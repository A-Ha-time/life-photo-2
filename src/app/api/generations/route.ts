import {NextResponse} from 'next/server';
import {z} from 'zod';

import {getEvolinkGenerationEnv, getEvolinkWebhookSecret} from '@/server/env';
import {getUserId} from '@/server/user';
import {ensureSchema, sql} from '@/server/db';
import {getSceneById} from '@/lib/scenes';
import {getCredits, trySpendCredits, refundCredits, COST_2K, COST_4K} from '@/server/credits';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CreateGenerationSchema = z.object({
  sceneId: z.string().min(1),
  frontUploadId: z.string().min(1),
  sideUploadId: z.string().optional(),
  fullUploadId: z.string().optional(),
  refUploadIds: z.array(z.string().min(1)).optional(),
  customPrompt: z.string().max(2000).optional(),
  gender: z.enum(['male', 'female']).default('male'),
  sizePreset: z.enum(['1:1', '2:3', '3:4', '4:3', '9:16', '16:9']).default('3:4'),
  qualityPreset: z.enum(['hd', 'uhd']).default('hd')
});

function mapSizePresetToRatio(sizePreset: string): string {
  switch (sizePreset) {
    case '2:3':
      return '2:3';
    case '3:4':
      return '3:4';
    case '4:3':
      return '4:3';
    case '9:16':
      return '9:16';
    case '16:9':
      return '16:9';
    case '1:1':
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
  compositionHint,
  cameraHint,
  poseHint,
  customPrompt,
  gender,
  hasFullBody,
  hasSide
}: {
  sceneHint: string;
  compositionHint: string;
  cameraHint: string;
  poseHint: string;
  customPrompt?: string;
  gender: 'male' | 'female';
  hasFullBody: boolean;
  hasSide: boolean;
}) {
  const identity = [
    'Strictly keep the same person identity as the reference photos:',
    '- same face shape and facial features (eyes, nose, mouth, jawline, eyebrows).',
    '- same hairstyle, hair length and hair color.',
    '- same skin tone, body build, and proportions.',
    '- clothing can adapt to the scene (gear/outfit that fits the environment) while keeping the same person.',
    '- do not change ethnicity, age, or gender.',
    'Do not introduce a different person. No face swap. No new identity.',
    'If there is any conflict between identity and composition, always prioritize identity.'
  ].join(' ');

  const quality = [
    'Photorealistic and natural: true skin texture, natural hair flow, realistic fabric folds, lighting and shadows matching the environment.',
    'Pose and facial expression must fit the scene/action naturally (e.g., surfing -> dynamic action, balanced stance, appropriate gaze).',
    'No cartoon, no painting, no plastic skin, no extra limbs, no missing limbs, no distorted face, no watermark, no text.'
  ].join(' ');

  const scene = [
    `Scene: ${sceneHint}.`,
    `Composition: ${compositionHint}.`,
    `Camera & lens: ${cameraHint}.`,
    `Pose & action: ${poseHint}.`,
    'Match the scene reference composition as closely as possible: camera angle, framing, subject scale, and lighting.',
    'Use the scene for background, environment, lighting, color mood, and overall composition.',
    'Do NOT use any faces or people from the scene reference; the only person must be from the user photos.',
    'The last two reference images are the scene references. Follow their composition and lighting.'
  ].join(' ');
  const genderHint = `Subject gender: ${gender}. Keep it consistent with the reference photos.`;
  const bodyHint = hasFullBody
    ? 'A full-body reference is provided; keep body proportions and limb lengths consistent.'
    : hasSide
      ? 'A side reference is provided; keep facial profile and head shape consistent.'
      : 'Only frontal reference is provided; infer body carefully while keeping proportions consistent.';
  const extra = customPrompt ? `User request: ${customPrompt}` : '';

  return [identity, quality, scene, genderHint, bodyHint, extra].filter(Boolean).join(' ');
}

async function getUploadUrlById(userId: string, uploadId: string) {
  const result =
    await sql`SELECT url FROM uploads WHERE id = ${uploadId} AND user_id = ${userId} LIMIT 1`;
  return (result.rows[0]?.url as string | undefined) ?? null;
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({error: '请先登录后再生成照片'}, {status: 401});
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

  // 用户最多 3 张，优先使用人物图；不足 3 张时重复主图补齐，场景图仅作背景参考
  const personImagesRaw = [frontUrl, ...(sideUrl ? [sideUrl] : []), ...(fullUrl ? [fullUrl] : []), ...refUrls];
  const personImages = personImagesRaw.filter(Boolean).slice(0, 3) as string[];
  while (personImages.length < 3) {
    personImages.push(frontUrl);
  }
  const userImageUrls = personImages.slice(0, 3);
  const sceneRef = scene.coverImageUrl[parsed.data.gender];
  const image_urls = [...userImageUrls, sceneRef, sceneRef].slice(0, 6);

  const size = mapSizePresetToRatio(parsed.data.sizePreset);
  const quality = mapQualityPresetToApi(parsed.data.qualityPreset);

  const creditsCost = parsed.data.qualityPreset === 'uhd' ? COST_4K : COST_2K;

  const prompt = buildPrompt({
    sceneHint: scene.promptHint.en,
    compositionHint: scene.compositionHint.en,
    cameraHint: scene.cameraHint.en,
    poseHint: scene.poseHint.en,
    customPrompt: parsed.data.customPrompt,
    gender: parsed.data.gender,
    hasFullBody: Boolean(fullUrl),
    hasSide: Boolean(sideUrl)
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

  await getCredits(userId);
  const canSpend = await trySpendCredits(userId, creditsCost, 'generation', null);
  if (!canSpend) {
    return NextResponse.json({error: '积分不足，请先获取积分再生成'}, {status: 402});
  }

  let resp: Response;
  try {
    resp = await fetch('https://api.evolink.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.EVOLINK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    await refundCredits(userId, creditsCost, 'generation_failed', null);
    return NextResponse.json({error: '创建任务失败', details: String(e ?? '')}, {status: 502});
  }

  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    await refundCredits(userId, creditsCost, 'generation_failed', null);
    return NextResponse.json({error: '创建任务失败', details: data}, {status: 502});
  }

  const taskId = typeof data?.id === 'string' ? (data.id as string) : null;
  if (!taskId) {
    await refundCredits(userId, creditsCost, 'generation_failed', null);
    return NextResponse.json({error: '返回任务ID异常', details: data}, {status: 502});
  }

  await sql`
    INSERT INTO generation_tasks
      (id, user_id, scene_id, status, progress, model, prompt, size, quality, request_json, response_json, credits_cost)
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
        ${JSON.stringify(data)}::jsonb,
        ${creditsCost}
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
      credits_cost = EXCLUDED.credits_cost,
      updated_at = NOW()
  `;

  return NextResponse.json({
    taskId,
    status: data.status ?? 'pending',
    estimatedTime: data?.task_info?.estimated_time ?? null
  });
}
