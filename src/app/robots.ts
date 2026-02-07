import {getSiteUrl} from '@/lib/seo';

export default function robots() {
  const baseUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
