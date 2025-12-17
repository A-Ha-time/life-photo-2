import createMiddleware from 'next-intl/middleware';
import {NextResponse, type NextRequest} from 'next/server';

import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request) ?? NextResponse.next();

  const uid = request.cookies.get('uid')?.value;
  if (!uid) {
    response.cookies.set('uid', crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });
  }

  return response;
}

export const config = {
  matcher: ['/', '/(en|zh|ko|ja)/:path*']
};
