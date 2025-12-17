import {NextResponse} from 'next/server';
import {z} from 'zod';

import {getEvolinkGenerationEnv, getEvolinkWebhookSecret} from '@/server/env';
import {getUserId} from '@/server/user';
import {ensureSchema, sql} from '@/server/db';
import {getSceneById} from '@/lib/scenes';

export const runtime = 'nodejs';

const CreateGenerationSchema = z.object({
  sceneId: z.string().min(1),
  frontUploadId: z.string().min(1),
  sideUploadId: z.string().optional(),
  fullUploadId: z.string().optional(),
  refUploadIds: z.array(z.string().min(1)).optional(),
  customPrompt: z.string().max(2000).optional(),
  sizePreset: z.enum(['1024x1024', '1024x768', '768x1024', '2048x2048']).default('1024x1024'),
  qualityPreset: z.enum(['standard', 'hd', 'uhd']).default('hd')
});

function mapSizePresetToRatio(sizePreset: string): string {
  switch (sizePreset) {
    case '1024x768':
      return '4:3';
    case '768x1024':
      return '3:4';
    case '2048x2048':
      return '1:1';
    case '1024x1024':
    default:
      return '1:1';
  }
}

function mapQualityPresetToApi(qualityPreset: string): '1K' | '2K' | '4K' {
  switch (qualityPreset) {
    case 'standard':
      return '1K';
    case 'uhd':
      return '4K';
    case 'hd':
    default:
      return '2K';
  }
}

function buildPrompt({
  sceneHint,
  customPrompt
}: {
  sceneHint: string;
  customPrompt?: string;
}) {
  const base = [
    'Create a photorealistic social media photo.',
    'Keep the person identity consistent with the provided reference photo(s): same face, same key facial features.',
    'High realism, natural skin texture, realistic lighting, realistic shadows, professional photography.',
    'No cartoon, no painting, no plastic skin, no extra limbs, no distorted face, no watermark, no text.'
  ].join(' ');

  const scene = `Scene: ${sceneHint}.`;
  const extra = customPrompt ? `User request: ${customPrompt}` : '';
  return [base, scene, extra].filter(Boolean).join(' ');
}

async function getUploadUrlById(userId: string, uploadId: string) {
  const result =
    await sql`SELECT url FROM uploads WHERE id = ${uploadId} AND user_id = ${userId} LIMIT 1`;
  return (result.rows[0]?.url as string | undefined) ?? null;
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({error: '缺少用户标识（uid）'}, {status: 401});
  }

  const json = await request.json().catch(() => null);
  const parsed = CreateGenerationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({error: '参数错误', details: parsed.error.issues}, {status: 400});
  }

  const scene = getSceneById(parsed.data.sceneId);
  if (!scene) {
    return NextResponse.json({error: '未知场景'}, {status: 400});
  }

  let env: ReturnType<typeof getEvolinkGenerationEnv>;
  try {
    env = getEvolinkGenerationEnv();
  } catch (e) {
    return NextResponse.json(
      {error: e instanceof Error ? e.message : '服务端未配置（缺少环境变量）'},
      {status: 500}
    );
  }
  await ensureSchema();
  const baseUrl = env.APP_BASE_URL ?? new URL(request.url).origin;

  const frontUrl = await getUploadUrlById(userId, parsed.data.frontUploadId);
  if (!frontUrl) return NextResponse.json({error: '正面照未找到'}, {status: 400});

  const sideUrl = parsed.data.sideUploadId
    ? await getUploadUrlById(userId, parsed.data.sideUploadId)
    : null;
  const fullUrl = parsed.data.fullUploadId
    ? await getUploadUrlById(userId, parsed.data.fullUploadId)
    : null;

  const refUrls: string[] = [];
  for (const id of (parsed.data.refUploadIds ?? []).slice(0, 10)) {
    const u = await getUploadUrlById(userId, id);
    if (u) refUrls.push(u);
  }

  // Evolink 文档：最多传入 5 张真人图像。这里保守限制“用户上传图”最多 5 张（front/side/full/ref）。
  const userImageUrls = [frontUrl, ...(sideUrl ? [sideUrl] : []), ...(fullUrl ? [fullUrl] : []), ...refUrls].slice(
    0,
    5
  );
  const image_urls = [scene.coverImageUrl, ...userImageUrls].slice(0, 10);

  const size = mapSizePresetToRatio(parsed.data.sizePreset);
  const quality = mapQualityPresetToApi(parsed.data.qualityPreset);

  const prompt = buildPrompt({
    sceneHint: scene.promptHint.en,
    customPrompt: parsed.data.customPrompt
  });

  // 回调不是必须，但推荐启用；本地开发请用 ngrok / cloudflared 提供 https 公网域名
  let callback_url: string | undefined;
  try {
    const secret = getEvolinkWebhookSecret();
    if (baseUrl.startsWith('https://')) {
      callback_url = `${baseUrl.replace(/\/$/, '')}/api/webhooks/evolink?secret=${encodeURIComponent(secret)}`;
    } else {
      callback_url = undefined;
    }
  } catch {
    callback_url = undefined;
  }

  const body = {
    model: 'nano-banana-2-lite',
    prompt,
    size,
    quality,
    image_urls,
    ...(callback_url ? {callback_url} : {})
  };

  const resp = await fetch('https://api.evolink.ai/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.EVOLINK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    return NextResponse.json({error: '创建任务失败', details: data}, {status: 502});
  }

  const taskId = typeof data?.id === 'string' ? (data.id as string) : null;
  if (!taskId) {
    return NextResponse.json({error: '返回任务ID异常', details: data}, {status: 502});
  }

  await sql`
    INSERT INTO generation_tasks
      (id, user_id, scene_id, status, progress, model, prompt, size, quality, request_json, response_json)
    VALUES
      (
        ${taskId},
        ${userId},
        ${scene.id},
        ${String(data.status ?? 'pending')},
        ${Number(data.progress ?? 0)},
        ${String(data.model ?? body.model)},
        ${prompt},
        ${size},
        ${quality},
        ${JSON.stringify(body)}::jsonb,
        ${JSON.stringify(data)}::jsonb
      )
    ON CONFLICT (id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      scene_id = EXCLUDED.scene_id,
      status = EXCLUDED.status,
      progress = EXCLUDED.progress,
      model = EXCLUDED.model,
      prompt = EXCLUDED.prompt,
      size = EXCLUDED.size,
      quality = EXCLUDED.quality,
      request_json = EXCLUDED.request_json,
      response_json = EXCLUDED.response_json,
      updated_at = NOW()
  `;

  return NextResponse.json({
    taskId,
    status: data.status ?? 'pending',
    estimatedTime: data?.task_info?.estimated_time ?? null
  });
}
