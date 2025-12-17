import {getTranslations} from 'next-intl/server';

import {getUserId} from '@/server/user';
import {ensureSchema, sql} from '@/server/db';

import {ProfileClient} from './ui/ProfileClient';

export default async function ProfilePage() {
  const userId = await getUserId();
  if (!userId) return null;

  const t = await getTranslations('Profile');
  void t;

  await ensureSchema();
  const profileRes = await sql`
    SELECT display_name, email, avatar_url
    FROM profiles
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  const profile = profileRes.rows[0] as {display_name: string; email: string | null; avatar_url: string | null};

  const imagesCountRes = await sql`
    SELECT COUNT(*)::int AS n
    FROM images i
    JOIN generation_tasks gt ON gt.id = i.task_id
    WHERE gt.user_id = ${userId}
  `;
  const favoritesCountRes = await sql`SELECT COUNT(*)::int AS n FROM favorites WHERE user_id = ${userId}`;

  const itemsRes = await sql`
    SELECT i.id, i.url, i.created_at, gt.scene_id,
           CASE WHEN f.image_id IS NULL THEN 0 ELSE 1 END AS favorited
    FROM images i
    JOIN generation_tasks gt ON gt.id = i.task_id
    LEFT JOIN favorites f ON f.user_id = gt.user_id AND f.image_id = i.id
    WHERE gt.user_id = ${userId}
    ORDER BY i.created_at DESC
    LIMIT 24
  `;
  const items = itemsRes.rows.map((r) => ({
    ...r,
    created_at: r.created_at instanceof Date ? r.created_at.getTime() : Date.now()
  })) as unknown as {id: string; url: string; created_at: number; scene_id: string; favorited: 0 | 1}[];

  return (
    <ProfileClient
      initialProfile={{
        displayName: profile.display_name,
        email: profile.email,
        avatarUrl: profile.avatar_url
      }}
      initialStats={{
        images: (imagesCountRes.rows[0]?.n as number) ?? 0,
        favorites: (favoritesCountRes.rows[0]?.n as number) ?? 0
      }}
      initialItems={items}
    />
  );
}
