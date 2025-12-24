import {NextResponse} from 'next/server';

import {getBaseUrlFromRequest} from '@/server/env';
import {getSupabaseAuthUrl} from '@/server/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const baseUrl = getBaseUrlFromRequest(request);
  const authUrl = getSupabaseAuthUrl();
  const {searchParams} = new URL(request.url);
  const next = searchParams.get('next') || '/home';
  const redirectTo = `${baseUrl}/api/auth/callback?next=${encodeURIComponent(next)}`;
  const target = `${authUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
  return NextResponse.redirect(target);
}
