import 'server-only';

import {cookies} from 'next/headers';

import {createSupabaseServerClient} from './supabase';

const ACCESS_COOKIE = 'sb-access-token';
const REFRESH_COOKIE = 'sb-refresh-token';
const EXPIRES_COOKIE = 'sb-expires-at';

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export function getAuthSessionFromCookies(): AuthSession | null {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  const expiresAtRaw = cookieStore.get(EXPIRES_COOKIE)?.value;
  if (!accessToken || !refreshToken || !expiresAtRaw) return null;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt)) return null;
  return {accessToken, refreshToken, expiresAt};
}

export async function getSupabaseUser() {
  const session = getAuthSessionFromCookies();
  if (!session) return null;
  const supabase = createSupabaseServerClient();
  const {data, error} = await supabase.auth.getUser(session.accessToken);
  if (error || !data.user) return null;
  return data.user;
}

export function clearAuthCookies(response: Response) {
  response.headers.append('Set-Cookie', `${ACCESS_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  response.headers.append('Set-Cookie', `${REFRESH_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  response.headers.append('Set-Cookie', `${EXPIRES_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
}

export function setAuthCookies(response: Response, session: AuthSession, secure: boolean) {
  const base = `Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
  response.headers.append('Set-Cookie', `${ACCESS_COOKIE}=${session.accessToken}; ${base}`);
  response.headers.append('Set-Cookie', `${REFRESH_COOKIE}=${session.refreshToken}; ${base}`);
  response.headers.append('Set-Cookie', `${EXPIRES_COOKIE}=${session.expiresAt}; ${base}`);
}
