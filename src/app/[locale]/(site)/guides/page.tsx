import type {Metadata} from 'next';

import {Link} from '@/i18n/navigation';
import type {AppLocale} from '@/i18n/routing';
import {getGuides} from '@/lib/guides';
import {
  getDefaultSocialImage,
  getLocaleAlternates,
  getLocalizedUrl,
  getOpenGraphAlternateLocales,
  getOpenGraphLocale,
  getSiteUrl
} from '@/lib/seo';

function getGuidesPageText(locale: AppLocale) {
  if (locale === 'zh') {
    return {
      title: 'AI 照片创作指南',
      description: '围绕 AI 头像、交友照片、社媒照片和人脸一致性的实操指南合集。'
    };
  }

  return {
    title: 'AI Photo Guides',
    description: 'Practical guides for AI headshots, social media photos, dating profile photos, and face consistency.'
  };
}

export async function generateMetadata({
  params
}: {
  params: {locale: AppLocale};
}): Promise<Metadata> {
  const {locale} = params;
  const socialImage = getDefaultSocialImage();
  const copy = getGuidesPageText(locale);
  const canonical = getLocalizedUrl(locale, '/guides');
  const languages = getLocaleAlternates('/guides');

  return {
    title: `${copy.title} | LUMINA STUDIO`,
    description: copy.description,
    alternates: {
      canonical,
      languages
    },
    openGraph: {
      title: `${copy.title} | LUMINA STUDIO`,
      description: copy.description,
      url: canonical,
      siteName: 'LUMINA STUDIO',
      locale: getOpenGraphLocale(locale),
      alternateLocale: getOpenGraphAlternateLocales(locale),
      type: 'website',
      images: [{url: socialImage, width: 1200, height: 630, alt: `${copy.title} | LUMINA STUDIO`}]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${copy.title} | LUMINA STUDIO`,
      description: copy.description,
      images: [socialImage]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function GuidesPage({params}: {params: {locale: AppLocale}}) {
  const locale = params.locale;
  const copy = getGuidesPageText(locale);
  const guides = getGuides(locale);
  const baseUrl = getSiteUrl();
  const homeUrl = `${baseUrl}/${locale}/home`;
  const guidesUrl = `${baseUrl}/${locale}/guides`;
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: guides.map((guide, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${baseUrl}/${locale}/guides/${guide.slug}`,
      name: guide.copy.title
    }))
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'zh' ? '首页' : 'Home',
        item: homeUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: copy.title,
        item: guidesUrl
      }
    ]
  };
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.title,
    description: copy.description,
    url: guidesUrl,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: 'LUMINA STUDIO',
      url: homeUrl
    }
  };

  return (
    <main style={{paddingTop: 100, paddingBottom: 64}}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(itemListSchema)}}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(collectionPageSchema)}}
      />
      <section className="section-spacing" style={{paddingTop: 32}}>
        <div className="container-studio" style={{maxWidth: 960}}>
          <header style={{textAlign: 'center', marginBottom: 40}}>
            <h1 className="title-elegant" style={{fontSize: '3rem', marginBottom: 16}}>
              {copy.title}
            </h1>
            <p className="subtitle-elegant" style={{maxWidth: 720, margin: '0 auto'}}>
              {copy.description}
            </p>
          </header>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20}}>
            {guides.map((guide) => (
              <article className="studio-card" key={guide.slug}>
                <h2 style={{fontSize: '1.2rem', color: 'var(--gold-primary)', marginBottom: 10}}>{guide.copy.title}</h2>
                <p style={{color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16}}>{guide.copy.description}</p>
                <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12}}>
                  Updated: {guide.updatedAt}
                </p>
                <Link href={`/guides/${guide.slug}`} className="btn-outline-gold" style={{textDecoration: 'none'}}>
                  {locale === 'zh' ? '查看指南' : 'Read Guide'}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
