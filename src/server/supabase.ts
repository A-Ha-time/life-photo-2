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
