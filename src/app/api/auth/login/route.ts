import {NextResponse} from 'next/server';

import {getBaseUrlFromRequest} from '@/server/env';
import {getSupabaseAuthUrl} from '@/server/supabase';
import {createPkcePair, PKCE_COOKIE_NAME} from '@/server/pkce';
import {routing} from '@/i18n/routing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const baseUrl = getBaseUrlFromRequest(request);
  const authUrl = getSupabaseAuthUrl();
  const {searchParams} = new URL(request.url);
  const defaultNext = `/${routing.defaultLocale}/home`;
  const next = searchParams.get('next') || defaultNext;
  const redirectTo = `${baseUrl}/api/auth/callback?next=${encodeURIComponent(next)}`;
  const {verifier, challenge} = createPkcePair();
  const target = `${authUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
    redirectTo
  )}&code_challenge=${encodeURIComponent(challenge)}&code_challenge_method=s256&response_type=code`;
  const response = NextResponse.redirect(target);
  const secure = baseUrl.startsWith('https://');
  response.cookies.set(PKCE_COOKIE_NAME, verifier, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/api/auth/callback',
    maxAge: 60 * 10
  });
  return response;
}
