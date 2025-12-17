import {NextResponse} from 'next/server';

import {ensureSchema, sql} from '@/server/db';
import {getUserId} from '@/server/user';
import {getEvolinkGenerationEnv} from '@/server/env';

export const runtime = 'nodejs';

export async function GET(_request: Request, {params}: {params: {id: string}}) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({error: '缺少用户标识（uid）'}, {status: 401});

  await ensureSchema();
  const taskRes = await sql`
    SELECT id, scene_id, status, progress, model, size, quality, created_at, updated_at, response_json
    FROM generation_tasks
    WHERE id = ${params.id} AND user_id = ${userId}
    LIMIT 1
  `;
  let task = taskRes.rows[0] as
    | {
        id: string;
        scene_id: string;
        status: string;
        progress: number;
        model: string;
        size: string;
        quality: string;
        created_at: Date;
        updated_at: Date;
        response_json: any;
      }
    | undefined;

  if (!task) return NextResponse.json({error: '任务不存在'}, {status: 404});

  const updatedAtMs = task.updated_at instanceof Date ? task.updated_at.getTime() : Date.now();
  const shouldRefresh =
    !['completed', 'failed', 'cancelled'].includes(String(task.status)) &&
    // 避免过于频繁请求上游
    Date.now() - updatedAtMs > 1500;

  if (shouldRefresh) {
    try {
      const env = getEvolinkGenerationEnv();
      const upstream = await fetch(`https://api.evolink.ai/v1/tasks/${encodeURIComponent(task.id)}`, {
        method: 'GET',
        headers: {Authorization: `Bearer ${env.EVOLINK_API_KEY}`}
      });
      const payload = await upstream.json().catch(() => null);
      if (upstream.ok && payload && typeof payload === 'object') {
        const status = String((payload as any).status ?? task.status);
        const progress = Number((payload as any).progress ?? task.progress);
        const safeProgress = Number.isFinite(progress)
          ? Math.max(0, Math.min(100, Math.round(progress)))
          : Number(task.progress ?? 0);
        await sql`
          UPDATE generation_tasks
          SET status = ${status},
              progress = ${safeProgress},
              response_json = ${JSON.stringify(payload)}::jsonb,
              updated_at = NOW()
          WHERE id = ${task.id}
        `;

        // 写入结果图（同 webhook 逻辑）
        if (status === 'completed') {
          const urls = new Set<string>();
          const collect = (value: unknown) => {
            if (typeof value === 'string') {
              if (/^https?:\/\//i.test(value)) urls.add(value);
              return;
            }
            if (Array.isArray(value)) {
              for (const item of value) collect(item);
              return;
            }
            if (value && typeof value === 'object') {
              for (const [, v] of Object.entries(value)) collect(v);
            }
          };
          collect(payload);

          const requestRes = await sql`SELECT request_json FROM generation_tasks WHERE id = ${task.id} LIMIT 1`;
          const requestJson = (requestRes.rows[0]?.request_json as any) ?? null;
          const inputUrls = new Set<string>(
            Array.isArray(requestJson?.image_urls) ? (requestJson.image_urls as string[]) : []
          );
          const filtered = [...urls].filter((u) => !inputUrls.has(u));

          for (const u of filtered) {
            await sql`
              INSERT INTO images (id, task_id, url)
              VALUES (${crypto.randomUUID()}, ${task.id}, ${u})
              ON CONFLICT (task_id, url) DO NOTHING
            `;
          }
        }

        const refreshed = await sql`
          SELECT id, scene_id, status, progress, model, size, quality, created_at, updated_at, response_json
          FROM generation_tasks
          WHERE id = ${params.id} AND user_id = ${userId}
          LIMIT 1
        `;
        task = refreshed.rows[0] as typeof task;
      }
    } catch {
      // 忽略上游刷新失败，仍返回本地缓存状态
    }
  }

  const imagesRes = await sql`
    SELECT id, url, created_at
    FROM images
    WHERE task_id = ${task.id}
    ORDER BY created_at ASC
  `;
  const images = imagesRes.rows as {id: string; url: string; created_at: Date}[];

  return NextResponse.json({
    task: {
      id: task.id,
      sceneId: task.scene_id,
      status: task.status,
      progress: task.progress,
      model: task.model,
      size: task.size,
      quality: task.quality,
      createdAt: task.created_at instanceof Date ? task.created_at.getTime() : Date.now(),
      updatedAt: task.updated_at instanceof Date ? task.updated_at.getTime() : Date.now(),
      raw: task.response_json ?? null
    },
    images: images.map((img) => ({
      id: img.id,
      url: img.url,
      created_at: img.created_at instanceof Date ? img.created_at.getTime() : Date.now()
    }))
  });
}
