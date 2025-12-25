'use client';

import {useEffect, useRef, useState} from 'react';
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
  const [promoOpen, setPromoOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const creditsItems = t.raw('creditsRules.items') as string[];
  const promoItems = t.raw('promo.items') as string[];
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

  useEffect(() => {
    if (state.status !== 'signedOut') return;
    setPromoOpen(true);
  }, [state.status]);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const dismissPromo = () => {
    setPromoOpen(false);
  };

  if (state.status === 'loading') return null;

  if (state.status === 'signedOut') {
    return (
      <>
        <a className="btn-outline-gold btn-compact" href={`/api/auth/login?next=${encodeURIComponent(nextPath)}`}>
          {t('signIn')}
        </a>
        {promoOpen ? (
          <div className="auth-modal-backdrop" role="dialog" aria-modal="true">
            <div className="auth-modal">
              <div className="auth-modal-title">{t('promo.title')}</div>
              <p className="auth-modal-subtitle">{t('promo.subtitle')}</p>
              <ul className="auth-modal-list">
                {promoItems.map((item, idx) => (
                  <li key={`${item}-${idx}`}>{item}</li>
                ))}
              </ul>
              <div className="auth-modal-actions">
                <button className="btn-outline-gold btn-compact" type="button" onClick={dismissPromo}>
                  {t('promo.close')}
                </button>
                <a
                  className="btn-gold btn-compact"
                  href={`/api/auth/login?next=${encodeURIComponent(nextPath)}`}
                  onClick={dismissPromo}
                >
                  {t('promo.cta')}
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
        <button
          className="badge-gold badge-compact auth-credits-button"
          type="button"
          onClick={() => setCreditsOpen(true)}
        >
          <i className="fas fa-coins" />
          {t('credits', {count: state.credits.balance})}
        </button>
        <div className="auth-menu" ref={menuRef}>
          <button
            className="btn-outline-gold btn-compact auth-user-button"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span>{state.user.name}</span>
            <i className={`fas fa-chevron-${menuOpen ? 'up' : 'down'}`} />
          </button>
          {menuOpen ? (
            <div className="auth-dropdown">
              <div className="auth-dropdown-title">{t('account')}</div>
              {state.user.email ? <div className="auth-dropdown-meta">{state.user.email}</div> : null}
              <div className="auth-dropdown-divider" />
              <a className="auth-dropdown-link" href={`/api/auth/logout?next=${encodeURIComponent(nextPath)}`}>
                {t('signOut')}
              </a>
            </div>
          ) : null}
        </div>
      </div>
      {creditsOpen ? (
        <div className="auth-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setCreditsOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-title">{t('creditsRules.title')}</div>
            <p className="auth-modal-subtitle">{t('creditsRules.subtitle')}</p>
            <ul className="auth-modal-list">
              {creditsItems.map((item, idx) => (
                <li key={`${item}-${idx}`}>{item}</li>
              ))}
            </ul>
            <div className="auth-modal-actions">
              <button className="btn-outline-gold btn-compact" type="button" onClick={() => setCreditsOpen(false)}>
                {t('creditsRules.close')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
