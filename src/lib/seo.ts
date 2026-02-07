const defaultSiteUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://luminastudio.top';

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`.replace(/\/$/, '');

  return defaultSiteUrl;
}
