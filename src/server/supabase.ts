import 'server-only';

import {createClient} from '@supabase/supabase-js';

function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase env: SUPABASE_URL and SUPABASE_ANON_KEY are required.');
  }

  return {url, key};
}

export function createSupabaseServerClient() {
  const {url, key} = getSupabaseEnv();
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

export function getSupabaseAuthUrl() {
  const {url} = getSupabaseEnv();
  return url.replace(/\/$/, '');
}

export async function exchangeSupabaseCodeForSession(authCode: string, codeVerifier: string) {
  const {url, key} = getSupabaseEnv();
  const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/token?grant_type=pkce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      auth_code: authCode,
      code_verifier: codeVerifier
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      payload?.error_description || payload?.message || payload?.error || 'Supabase auth failed';
    throw new Error(message);
  }

  return payload;
}
