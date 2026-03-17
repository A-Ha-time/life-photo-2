import {routing, type AppLocale} from '@/i18n/routing';

const defaultSiteUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://luminastudio.top';
const defaultSocialImage =
  'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&h=630&fit=crop';
const openGraphLocaleMap: Record<AppLocale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  ko: 'ko_KR',
  ja: 'ja_JP'
};

function normalizeUrl(input?: string) {
  if (!input) return undefined;
  const trimmed = input.trim().replace(/\/$/, '');
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

export function getSiteUrl() {
  const explicit = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL);
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_URL;
  const vercelUrl = normalizeUrl(vercel);
  if (vercelUrl) return vercelUrl;

  return defaultSiteUrl;
}

export function getDefaultSocialImage() {
  return defaultSocialImage;
}

function normalizePathname(pathname: string) {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.replace(/\/+$/, '');
}

export function getLocalizedUrl(locale: AppLocale, pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  return `${getSiteUrl()}/${locale}${normalizedPathname === '/' ? '' : normalizedPathname}`;
}

export function getLocaleAlternates(pathname: string) {
  const normalizedPathname = normalizePathname(pathname);
  const languages = routing.locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = getLocalizedUrl(locale, normalizedPathname);
    return acc;
  }, {});
  languages['x-default'] = getLocalizedUrl('en', normalizedPathname);
  return languages;
}

export function getOpenGraphLocale(locale: AppLocale) {
  return openGraphLocaleMap[locale];
}

export function getOpenGraphAlternateLocales(locale: AppLocale) {
  return routing.locales.filter((item) => item !== locale).map((item) => openGraphLocaleMap[item]);
}
