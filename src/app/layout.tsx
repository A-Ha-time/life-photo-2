import './globals.css';

import type {Metadata} from 'next';
import {cookies} from 'next/headers';

export const metadata: Metadata = {
  title: 'LUMINA STUDIO',
  description: 'AI-driven photo generation studio'
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'en';

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

