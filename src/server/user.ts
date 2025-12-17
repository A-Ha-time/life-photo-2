import {cookies} from 'next/headers';

import {ensureSchema, sql} from './db';

export async function getUserId() {
  const uid = cookies().get('uid')?.value;
  if (!uid) return null;

  await ensureSchema();
  await sql`INSERT INTO users (id) VALUES (${uid}) ON CONFLICT (id) DO NOTHING`;
  await sql`
    INSERT INTO preferences (user_id, locale, default_size, default_quality)
    VALUES (${uid}, 'en', '1:1', '2K')
    ON CONFLICT (user_id) DO NOTHING
  `;
  await sql`
    INSERT INTO profiles (user_id, display_name, email, avatar_url)
    VALUES (${uid}, 'Guest', NULL, NULL)
    ON CONFLICT (user_id) DO NOTHING
  `;

  return uid;
}
