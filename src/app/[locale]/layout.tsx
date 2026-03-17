import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';

import type {AppLocale} from '@/i18n/routing';
import {routing} from '@/i18n/routing';
import {
  getDefaultSocialImage,
  getOpenGraphAlternateLocales,
  getOpenGraphLocale,
  getSiteUrl
} from '@/lib/seo';

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
  const socialImage = getDefaultSocialImage();

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: 'LUMINA STUDIO',
      locale: getOpenGraphLocale(locale),
      alternateLocale: getOpenGraphAlternateLocales(locale),
      type: 'website',
      images: [
        {
          url: socialImage,
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
      images: [socialImage]
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
