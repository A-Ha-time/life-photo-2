'use client';

import {useTranslations} from 'next-intl';

import {Link, usePathname} from '@/i18n/navigation';
import {LanguageSwitcher} from './LanguageSwitcher';

export function Navbar() {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/home" className="navbar-logo">
          <i className="fas fa-camera-retro" />
          LUMINA STUDIO
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link href="/home" className={`navbar-link ${isActive('/home') ? 'active' : ''}`}>
              {t('home')}
            </Link>
          </li>
          <li>
            <Link href="/create" className={`navbar-link ${isActive('/create') ? 'active' : ''}`}>
              {t('create')}
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
            >
              {t('profile')}
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className={`navbar-link ${isActive('/privacy') ? 'active' : ''}`}
            >
              {t('privacy')}
            </Link>
          </li>
        </ul>

        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <LanguageSwitcher />
          <Link href="/create" className="navbar-cta">
            {t('cta')}
          </Link>
        </div>
      </div>
    </nav>
  );
}

