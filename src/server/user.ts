import {ensureSchema, sql} from './db';
import {getSupabaseUser} from './auth';

export async function getUserId() {
  const user = await getSupabaseUser();
  if (!user) return null;
  const uid = user.id;

  await ensureSchema();
  await sql`INSERT INTO users (id) VALUES (${uid}) ON CONFLICT (id) DO NOTHING`;
  await sql`
    INSERT INTO preferences (user_id, locale, default_size, default_quality)
    VALUES (${uid}, 'en', '3:4', '2K')
    ON CONFLICT (user_id) DO NOTHING
  `;
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || 'Guest';
  const avatarUrl = user.user_metadata?.avatar_url || null;
  const email = user.email ?? null;
  await sql`
    INSERT INTO profiles (user_id, display_name, email, avatar_url)
    VALUES (${uid}, ${displayName}, ${email}, ${avatarUrl})
    ON CONFLICT (user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      email = EXCLUDED.email,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = NOW()
  `;

  return uid;
}
