import {NextResponse} from 'next/server';
import {z} from 'zod';

import {getUserId} from '@/server/user';
import {ensureSchema, sql} from '@/server/db';

export const runtime = 'nodejs';

const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  email: z.string().email().max(100).optional(),
  avatarUrl: z.string().url().max(2048).optional()
});

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({error: '缺少用户标识（uid）'}, {status: 401});

  await ensureSchema();
  const profileRes = await sql`
    SELECT display_name, email, avatar_url, updated_at
    FROM profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  const profile = profileRes.rows[0] as
    | {display_name: string; email: string | null; avatar_url: string | null; updated_at: Date}
    | undefined;
  if (!profile) {
    return NextResponse.json({error: 'profile missing'}, {status: 404});
  }

  const imagesCountRes = await sql`
    SELECT COUNT(*)::int AS n
    FROM images i
    JOIN generation_tasks t ON t.id = i.task_id
    WHERE t.user_id = ${userId}
  `;
  const favoritesCountRes = await sql`
    SELECT COUNT(*)::int AS n
    FROM favorites
    WHERE user_id = ${userId}
  `;

  return NextResponse.json({
    profile: {
      displayName: profile.display_name,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      updatedAt: profile.updated_at instanceof Date ? profile.updated_at.getTime() : Date.now()
    },
    stats: {
      images: (imagesCountRes.rows[0]?.n as number) ?? 0,
      favorites: (favoritesCountRes.rows[0]?.n as number) ?? 0
    }
  });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({error: '缺少用户标识（uid）'}, {status: 401});

  const json = await request.json().catch(() => null);
  const parsed = UpdateProfileSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({error: '参数错误', details: parsed.error.issues}, {status: 400});
  }

  await ensureSchema();
  const prevRes = await sql`
    SELECT display_name, email, avatar_url
    FROM profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  const prev = prevRes.rows[0] as {display_name: string; email: string | null; avatar_url: string | null};

  const displayName = parsed.data.displayName ?? prev.display_name;
  const email = parsed.data.email ?? prev.email;
  const avatarUrl = parsed.data.avatarUrl ?? prev.avatar_url;

  await sql`
    UPDATE profiles
    SET display_name = ${displayName},
        email = ${email},
        avatar_url = ${avatarUrl},
        updated_at = NOW()
    WHERE user_id = ${userId}
  `;

  return NextResponse.json({ok: true});
}
