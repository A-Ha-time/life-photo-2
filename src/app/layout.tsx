import './globals.css';

import type {Metadata} from 'next';
import {headers} from 'next/headers';

import {routing, type AppLocale} from '@/i18n/routing';
import {getSiteUrl} from '@/lib/seo';

const googleVerificationToken =
  process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: 'LUMINA STUDIO',
  title: 'LUMINA STUDIO',
  description: 'AI-driven photo generation studio',
  verification: googleVerificationToken
    ? {
        google: googleVerificationToken
      }
    : undefined
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const headerList = headers();
  const requestLocale = headerList.get('x-next-intl-locale') as AppLocale | null;
  const htmlLang: AppLocale =
    requestLocale && routing.locales.includes(requestLocale) ? requestLocale : routing.defaultLocale;

  return (
    <html lang={htmlLang}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="alternate" type="application/rss+xml" title="LUMINA STUDIO Guides" href="/feed.xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
