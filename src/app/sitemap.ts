import type {MetadataRoute} from 'next';

import {getGuideMetaList} from '@/lib/guides';
import {routing} from '@/i18n/routing';
import {getSiteUrl} from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const routes = ['home', 'create', 'pricing', 'privacy', 'guides'] as const;
  const guideMetaList = getGuideMetaList();

  const pageEntries = routing.locales.flatMap((locale) =>
    routes.map((route) => {
      const languages = routing.locales.reduce<Record<string, string>>((acc, l) => {
        acc[l] = `${baseUrl}/${l}/${route}`;
        return acc;
      }, {});
      languages['x-default'] = `${baseUrl}/en/${route}`;

      return {
        url: `${baseUrl}/${locale}/${route}`,
        lastModified: now,
        changeFrequency: (route === 'home' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
        priority: route === 'home' ? 1 : 0.8,
        alternates: {
          languages
        }
      };
    })
  );

  const guideEntries = routing.locales.flatMap((locale) =>
    guideMetaList.map((guide) => {
      const languages = routing.locales.reduce<Record<string, string>>((acc, l) => {
        acc[l] = `${baseUrl}/${l}/guides/${guide.slug}`;
        return acc;
      }, {});
      languages['x-default'] = `${baseUrl}/en/guides/${guide.slug}`;

      return {
        url: `${baseUrl}/${locale}/guides/${guide.slug}`,
        lastModified: new Date(`${guide.updatedAt}T00:00:00.000Z`),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: {
          languages
        }
      };
    })
  );

  return [...pageEntries, ...guideEntries];
}
