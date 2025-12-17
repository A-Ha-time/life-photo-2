'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

import type {AppLocale} from '@/i18n/routing';
import {routing} from '@/i18n/routing';

export function LanguageSwitcher() {
  const t = useTranslations('Language');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
      <i className="fas fa-globe" style={{color: 'var(--gold-primary)'}} />
      <select
        aria-label={t('label')}
        value={locale}
        onChange={(e) => {
          const nextLocale = e.target.value as AppLocale;
          if (!routing.locales.includes(nextLocale)) return;
          router.replace(pathname, {locale: nextLocale});
        }}
        className="input-studio"
        style={{
          fontSize: '0.875rem',
          padding: '0.5rem 0.75rem',
          width: 'auto'
        }}
      >
        <option value="en">{t('en')}</option>
        <option value="zh">{t('zh')}</option>
        <option value="ko">{t('ko')}</option>
        <option value="ja">{t('ja')}</option>
      </select>
    </div>
  );
}

