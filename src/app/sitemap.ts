import type {MetadataRoute} from 'next';

import {routing} from '@/i18n/routing';
import {getSiteUrl} from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const routes = ['home', 'create', 'profile', 'privacy'];

  return routing.locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}/${route}`,
      lastModified: now,
      changeFrequency: route === 'home' ? 'weekly' : 'monthly',
      priority: route === 'home' ? 1 : 0.8
    }))
  );
}
