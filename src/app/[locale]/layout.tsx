import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';

import type {AppLocale} from '@/i18n/routing';
import {routing} from '@/i18n/routing';
import {getSiteUrl} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: {locale: AppLocale};
}): Promise<Metadata> {
  const {locale} = params;
  if (!routing.locales.includes(locale)) notFound();

  const t = await getTranslations({locale, namespace: 'SEO'});
  const title = t('title');
  const description = t('description');
  const keywords = t.raw('keywords') as string[];
  const baseUrl = getSiteUrl();
  const url = `${baseUrl}/${locale}/home`;
  const languages = routing.locales.reduce<Record<string, string>>((acc, l) => {
    acc[l] = `${baseUrl}/${l}/home`;
    return acc;
  }, {});

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'LUMINA STUDIO',
      locale,
      type: 'website',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&h=630&fit=crop',
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200&h=630&fit=crop']
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: AppLocale};
}) {
  const {locale} = params;
  if (!routing.locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
