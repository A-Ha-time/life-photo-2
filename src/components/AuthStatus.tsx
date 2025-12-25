'use client';

import {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname} from '@/i18n/navigation';

type AuthState =
  | {status: 'loading'}
  | {status: 'signedOut'}
  | {
      status: 'signedIn';
      user: {name: string; email: string | null; avatarUrl: string | null};
      credits: {balance: number};
    };

export function AuthStatus() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({status: 'loading'});
  const nextPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const resp = await fetch('/api/auth/me', {cache: 'no-store'});
        const data = await resp.json().catch(() => null);
        if (cancelled) return;
        if (!data?.user) {
          setState({status: 'signedOut'});
          return;
        }
        setState({
          status: 'signedIn',
          user: {
            name: data.user.name ?? 'Guest',
            email: data.user.email ?? null,
            avatarUrl: data.user.avatarUrl ?? null
          },
          credits: {balance: data.credits?.balance ?? 0}
        });
      } catch {
        if (!cancelled) setState({status: 'signedOut'});
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === 'loading') return null;

  if (state.status === 'signedOut') {
    return (
      <a className="btn-outline-gold btn-compact" href={`/api/auth/login?next=${encodeURIComponent(nextPath)}`}>
        {t('signIn')}
      </a>
    );
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
      <div className="badge-gold badge-compact">
        <i className="fas fa-coins" />
        {t('credits', {count: state.credits.balance})}
      </div>
      <a className="btn-outline-gold btn-compact" href={`/api/auth/logout?next=${encodeURIComponent(nextPath)}`}>
        {t('signOut')}
      </a>
    </div>
  );
}
