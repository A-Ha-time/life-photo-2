import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';

import type {AppLocale} from '@/i18n/routing';
import {
  getDefaultSocialImage,
  getLocaleAlternates,
  getLocalizedUrl,
  getOpenGraphAlternateLocales,
  getOpenGraphLocale
} from '@/lib/seo';

import {CreateClient} from './ui/CreateClient';

export async function generateMetadata({
  params
}: {
  params: {locale: AppLocale};
}): Promise<Metadata> {
  const {locale} = params;
  const [seo, create] = await Promise.all([
    getTranslations({locale, namespace: 'SEO'}),
    getTranslations({locale, namespace: 'Create'})
  ]);
  const socialImage = getDefaultSocialImage();
  const canonical = getLocalizedUrl(locale, '/create');
  const languages = getLocaleAlternates('/create');
  const title = `${create('title1')} ${create('title2')} | ${seo('siteName')}`;
  const description = create('subtitle');

  return {
    title,
    description,
    alternates: {
      canonical,
      languages
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: seo('siteName'),
      locale: getOpenGraphLocale(locale),
      alternateLocale: getOpenGraphAlternateLocales(locale),
      type: 'website',
      images: [{url: socialImage, width: 1200, height: 630, alt: title}]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    }
  };
}

export default async function CreatePage() {
  // 预加载翻译，保证缺失 key 能尽早暴露
  await getTranslations('Create');
  return <CreateClient />;
}
