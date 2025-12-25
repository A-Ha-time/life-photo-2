import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

import {exchangeSupabaseCodeForSession} from '@/server/supabase';
import {getBaseUrlFromRequest} from '@/server/env';
import {setAuthCookies} from '@/server/auth';
import {ensureSchema, sql} from '@/server/db';
import {getCredits} from '@/server/credits';
import {PKCE_COOKIE_NAME} from '@/server/pkce';

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

  const cookieStore = cookies();
  const codeVerifier = cookieStore.get(PKCE_COOKIE_NAME)?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(`${baseUrl}${next}`);
  }

  let payload: any;
  try {
    payload = await exchangeSupabaseCodeForSession(code, codeVerifier);
  } catch {
    return NextResponse.redirect(`${baseUrl}${next}`);
  }

  if (!payload?.access_token || !payload?.refresh_token || !payload?.user) {
    return NextResponse.redirect(`${baseUrl}${next}`);
  }

  const response = NextResponse.redirect(`${baseUrl}${next}`);
  const secure = baseUrl.startsWith('https://');
  response.cookies.set(PKCE_COOKIE_NAME, '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/api/auth/callback',
    maxAge: 0
  });
  setAuthCookies(
    response,
    {
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      expiresAt: payload.expires_at ?? Math.floor(Date.now() / 1000) + payload.expires_in
    },
    secure
  );

  await ensureSchema();
  const userId = payload.user.id;
  const displayName = payload.user.user_metadata?.full_name || payload.user.user_metadata?.name || 'Guest';
  const avatarUrl = payload.user.user_metadata?.avatar_url || null;
  const email = payload.user.email ?? null;

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
