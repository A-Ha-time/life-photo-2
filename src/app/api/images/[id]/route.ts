import {NextResponse} from 'next/server';

import {getUserId} from '@/server/user';
import {ensureSchema, sql} from '@/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(_request: Request, {params}: {params: {id: string}}) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({error: '缺少用户标识（uid）'}, {status: 401});

  await ensureSchema();
  const ownsRes = await sql`
    SELECT i.id
    FROM images i
    JOIN generation_tasks t ON t.id = i.task_id
    WHERE i.id = ${params.id} AND t.user_id = ${userId}
    LIMIT 1
  `;
  if (ownsRes.rows.length === 0) return NextResponse.json({error: '图片不存在'}, {status: 404});

  await sql`DELETE FROM images WHERE id = ${params.id}`;

  return NextResponse.json({ok: true});
}
