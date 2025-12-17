import {NextResponse} from 'next/server';
import {z} from 'zod';

import {getUserId} from '@/server/user';
import {ensureSchema, sql} from '@/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ToggleSchema = z.object({
  imageId: z.string().min(1)
});

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({error: '缺少用户标识（uid）'}, {status: 401});

  const json = await request.json().catch(() => null);
  const parsed = ToggleSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({error: '参数错误', details: parsed.error.issues}, {status: 400});
  }

  await ensureSchema();
  const ownsRes = await sql`
    SELECT 1
    FROM images i
    JOIN generation_tasks t ON t.id = i.task_id
    WHERE i.id = ${parsed.data.imageId} AND t.user_id = ${userId}
    LIMIT 1
  `;
  const owns = ownsRes.rows.length > 0;
  if (!owns) return NextResponse.json({error: '图片不存在'}, {status: 404});

  const existsRes = await sql`
    SELECT 1 FROM favorites WHERE user_id = ${userId} AND image_id = ${parsed.data.imageId} LIMIT 1
  `;
  const exists = existsRes.rows.length > 0;

  if (exists) {
    await sql`DELETE FROM favorites WHERE user_id = ${userId} AND image_id = ${parsed.data.imageId}`;
    return NextResponse.json({favorited: false});
  }

  await sql`
    INSERT INTO favorites (user_id, image_id)
    VALUES (${userId}, ${parsed.data.imageId})
    ON CONFLICT (user_id, image_id) DO NOTHING
  `;
  return NextResponse.json({favorited: true});
}
