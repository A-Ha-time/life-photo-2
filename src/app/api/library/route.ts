import {NextResponse} from 'next/server';
import {z} from 'zod';

import {getUserId} from '@/server/user';
import {ensureSchema, sql} from '@/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const QuerySchema = z.object({
  tab: z.enum(['all', 'favorites']).default('all'),
  limit: z.coerce.number().int().min(1).max(50).default(24)
});

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({error: '缺少用户标识（uid）'}, {status: 401});

  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse({
    tab: url.searchParams.get('tab') ?? 'all',
    limit: url.searchParams.get('limit') ?? '24'
  });
  if (!parsed.success) {
    return NextResponse.json({error: '参数错误', details: parsed.error.issues}, {status: 400});
  }

  await ensureSchema();
  if (parsed.data.tab === 'favorites') {
    const res = await sql`
      SELECT i.id, i.url, i.created_at, t.scene_id,
             1::int AS favorited
      FROM favorites f
      JOIN images i ON i.id = f.image_id
      JOIN generation_tasks t ON t.id = i.task_id
      WHERE f.user_id = ${userId}
      ORDER BY f.created_at DESC
      LIMIT ${parsed.data.limit}
    `;
    return NextResponse.json({
      items: res.rows.map((r) => ({
        ...r,
        created_at: r.created_at instanceof Date ? r.created_at.getTime() : Date.now()
      }))
    });
  }

  const res = await sql`
    SELECT i.id, i.url, i.created_at, t.scene_id,
           CASE WHEN f.image_id IS NULL THEN 0 ELSE 1 END AS favorited
    FROM images i
    JOIN generation_tasks t ON t.id = i.task_id
    LEFT JOIN favorites f ON f.user_id = t.user_id AND f.image_id = i.id
    WHERE t.user_id = ${userId}
    ORDER BY i.created_at DESC
    LIMIT ${parsed.data.limit}
  `;

  return NextResponse.json({
    items: res.rows.map((r) => ({
      ...r,
      created_at: r.created_at instanceof Date ? r.created_at.getTime() : Date.now()
    }))
  });
}
