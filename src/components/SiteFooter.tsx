'use client';

import {useTranslations} from 'next-intl';

import {Link} from '@/i18n/navigation';

export function SiteFooter() {
  const nav = useTranslations('Nav');
  const footer = useTranslations('Footer');

  return (
    <footer className="site-footer">
      <div className="container-studio site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/home" className="site-footer-logo">
            <i className="fas fa-camera-retro" />
            LUMINA STUDIO
          </Link>
          <p className="site-footer-desc">{footer('description')}</p>
        </div>

        <div>
          <h2 className="site-footer-title">{footer('quickLinks')}</h2>
          <nav className="site-footer-links" aria-label={footer('quickLinks')}>
            <Link href="/home">{nav('home')}</Link>
            <Link href="/create">{nav('create')}</Link>
            <Link href="/guides">{nav('guides')}</Link>
            <Link href="/privacy">{nav('privacy')}</Link>
          </nav>
        </div>

        <div>
          <h2 className="site-footer-title">{footer('resources')}</h2>
          <div className="site-footer-links">
            <Link href="/guides">{footer('guidesHub')}</Link>
            <a href="/sitemap.xml">{footer('sitemap')}</a>
            <a href="/robots.txt">{footer('robots')}</a>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="container-studio">{footer('copyright', {year: new Date().getFullYear()})}</div>
      </div>
    </footer>
  );
}
