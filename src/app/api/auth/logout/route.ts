import {NextResponse} from 'next/server';

import {getBaseUrlFromRequest} from '@/server/env';
import {clearAuthCookies} from '@/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const baseUrl = getBaseUrlFromRequest(request);
  const {searchParams} = new URL(request.url);
  const next = searchParams.get('next') || '/home';
  const response = NextResponse.redirect(`${baseUrl}${next}`);
  clearAuthCookies(response);
  return response;
}
