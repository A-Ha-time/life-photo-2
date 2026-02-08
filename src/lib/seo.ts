const defaultSiteUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://luminastudio.top';

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
