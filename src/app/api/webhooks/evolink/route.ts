import {NextResponse} from 'next/server';

import {ensureSchema, sql} from '@/server/db';
import {getEvolinkWebhookSecret} from '@/server/env';
import {refundCredits} from '@/server/credits';
import {persistGeneratedImages} from '@/server/image-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function collectImageUrls(value: unknown, out: Set<string>) {
  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value)) out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectImageUrls(item, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const [, v] of Object.entries(value)) collectImageUrls(v, out);
  }
}

export async function POST(request: Request) {
  let expectedSecret: string;
  try {
    expectedSecret = getEvolinkWebhookSecret();
  } catch (e) {
    return NextResponse.json(
      {error: e instanceof Error ? e.message : 'WEBHOOK_SECRET 未配置'},
      {status: 500}
    );
  }
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({error: 'unauthorized'}, {status: 401});
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({error: 'bad payload'}, {status: 400});
  }

  const taskId = typeof (payload as any).id === 'string' ? ((payload as any).id as string) : null;
  if (!taskId) return NextResponse.json({error: 'missing id'}, {status: 400});

  const status = String((payload as any).status ?? 'unknown');
  const progress = Number((payload as any).progress ?? 0);

  await ensureSchema();
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(100, Math.round(progress))) : 0;
  await sql`
    UPDATE generation_tasks
    SET status = ${status},
        progress = ${safeProgress},
        response_json = ${JSON.stringify(payload)}::jsonb,
        updated_at = NOW()
    WHERE id = ${taskId}
  `;

  if (status === 'failed' || status === 'cancelled') {
    const refundRes = await sql`
      SELECT user_id, credits_cost, credits_refunded
      FROM generation_tasks
      WHERE id = ${taskId}
      LIMIT 1
    `;
    const row = refundRes.rows[0] as {user_id: string; credits_cost: number; credits_refunded: boolean} | undefined;
    if (row && row.credits_cost > 0 && !row.credits_refunded) {
      await refundCredits(row.user_id, row.credits_cost, 'generation_refund', taskId);
      await sql`
        UPDATE generation_tasks
        SET credits_refunded = TRUE, updated_at = NOW()
        WHERE id = ${taskId}
      `;
    }
  }

  if (status === 'completed') {
    const urls = new Set<string>();
    collectImageUrls(payload, urls);

    const requestRes = await sql`SELECT request_json, user_id FROM generation_tasks WHERE id = ${taskId} LIMIT 1`;
    const requestJson = (requestRes.rows[0]?.request_json as any) ?? null;
    const taskUserId = (requestRes.rows[0]?.user_id as string | undefined) ?? null;
    const inputUrls = new Set<string>(
      Array.isArray(requestJson?.image_urls) ? (requestJson.image_urls as string[]) : []
    );

    // 避免把参考图/源图也当作“结果图”
    if (taskUserId) {
      await persistGeneratedImages({
        taskId,
        userId: taskUserId,
        urls: [...urls],
        inputUrls
      });
    }
  }

  return NextResponse.json({ok: true});
}
