'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

import type {AppLocale} from '@/i18n/routing';
import {routing} from '@/i18n/routing';
import {SelectMenu} from '@/components/SelectMenu';

export function LanguageSwitcher() {
  const t = useTranslations('Language');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
      <i className="fas fa-globe" style={{color: 'var(--gold-primary)'}} />
      <SelectMenu
        value={locale}
        options={[
          {value: 'en', label: t('en')},
          {value: 'zh', label: t('zh')},
          {value: 'ko', label: t('ko')},
          {value: 'ja', label: t('ja')}
        ]}
        onChange={(nextValue) => {
          const nextLocale = nextValue as AppLocale;
          if (!routing.locales.includes(nextLocale)) return;
          router.replace(pathname, {locale: nextLocale});
        }}
        buttonStyle={{
          fontSize: '0.875rem',
          padding: '0.5rem 0.75rem',
          width: 'auto',
          minWidth: 120
        }}
      />
    </div>
  );
}
