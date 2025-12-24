import {NextResponse} from 'next/server';

import {createSupabaseServerClient} from '@/server/supabase';
import {getBaseUrlFromRequest} from '@/server/env';
import {setAuthCookies} from '@/server/auth';
import {ensureSchema, sql} from '@/server/db';
import {getCredits} from '@/server/credits';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const baseUrl = getBaseUrlFromRequest(request);
  const {searchParams} = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/home';

  if (!code) {
    return NextResponse.redirect(`${baseUrl}${next}`);
  }

  const supabase = createSupabaseServerClient();
  const {data, error} = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session || !data.user) {
    return NextResponse.redirect(`${baseUrl}${next}`);
  }

  const session = data.session;
  const response = NextResponse.redirect(`${baseUrl}${next}`);
  const secure = baseUrl.startsWith('https://');
  setAuthCookies(
    response,
    {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at ?? Math.floor(Date.now() / 1000) + session.expires_in
    },
    secure
  );

  await ensureSchema();
  const userId = data.user.id;
  const displayName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'Guest';
  const avatarUrl = data.user.user_metadata?.avatar_url || null;
  const email = data.user.email ?? null;

  await sql`INSERT INTO users (id) VALUES (${userId}) ON CONFLICT (id) DO NOTHING`;
  await sql`
    INSERT INTO preferences (user_id, locale, default_size, default_quality)
    VALUES (${userId}, 'en', '3:4', '2K')
    ON CONFLICT (user_id) DO NOTHING
  `;
  await sql`
    INSERT INTO profiles (user_id, display_name, email, avatar_url)
    VALUES (${userId}, ${displayName}, ${email}, ${avatarUrl})
    ON CONFLICT (user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      email = EXCLUDED.email,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = NOW()
  `;

  await getCredits(userId);

  return response;
}
