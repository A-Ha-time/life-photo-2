import type {Metadata} from 'next';
import {getLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {Link} from '@/i18n/navigation';
import {routing, type AppLocale} from '@/i18n/routing';
import {getGuide, getGuideSlugs, getRelatedGuides} from '@/lib/guides';
import {getSiteUrl} from '@/lib/seo';

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({slug}));
}

export async function generateMetadata({
  params
}: {
  params: {locale: AppLocale; slug: string};
}): Promise<Metadata> {
  const {locale, slug} = params;
  const guide = getGuide(locale, slug);
  if (!guide) notFound();

  const baseUrl = getSiteUrl();
  const canonical = `${baseUrl}/${locale}/guides/${slug}`;
  const languages = routing.locales.reduce<Record<string, string>>((acc, l) => {
    acc[l] = `${baseUrl}/${l}/guides/${slug}`;
    return acc;
  }, {});
  languages['x-default'] = `${baseUrl}/en/guides/${slug}`;

  return {
    title: `${guide.copy.title} | LUMINA STUDIO`,
    description: guide.copy.description,
    alternates: {
      canonical,
      languages
    },
    openGraph: {
      title: `${guide.copy.title} | LUMINA STUDIO`,
      description: guide.copy.description,
      url: canonical,
      siteName: 'LUMINA STUDIO',
      locale,
      type: 'article'
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function GuideDetailPage({params}: {params: {locale: AppLocale; slug: string}}) {
  const locale = (await getLocale()) as AppLocale;
  const guide = getGuide(locale, params.slug);
  if (!guide) notFound();
  const relatedGuides = getRelatedGuides(locale, guide.slug, 3);

  const baseUrl = getSiteUrl();
  const homeUrl = `${baseUrl}/${locale}/home`;
  const guidesUrl = `${baseUrl}/${locale}/guides`;
  const canonical = `${baseUrl}/${locale}/guides/${guide.slug}`;
  const publishedAt = `${guide.updatedAt}T00:00:00.000Z`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.copy.title,
    description: guide.copy.description,
    datePublished: publishedAt,
    dateModified: publishedAt,
    inLanguage: locale,
    mainEntityOfPage: canonical,
    isPartOf: {
      '@type': 'CollectionPage',
      name: locale === 'zh' ? 'AI 照片创作指南' : 'AI Photo Guides',
      url: guidesUrl
    },
    author: {
      '@type': 'Organization',
      name: 'LUMINA STUDIO'
    },
    publisher: {
      '@type': 'Organization',
      name: 'LUMINA STUDIO'
    }
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.copy.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
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
        name: locale === 'zh' ? 'AI 照片创作指南' : 'AI Photo Guides',
        item: guidesUrl
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.copy.title,
        item: canonical
      }
    ]
  };
  const relatedListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: relatedGuides.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${baseUrl}/${locale}/guides/${item.slug}`,
      name: item.copy.title
    }))
  };
  const text =
    locale === 'zh'
      ? {
          back: '← 返回指南列表',
          faq: '常见问题',
          relatedTitle1: '相关推荐',
          relatedTitle2: '指南',
          relatedSubtitle: '继续阅读这些相关主题，增强页面间关联与内容完整度。',
          read: '阅读指南'
        }
      : {
          back: '← Back to guides',
          faq: 'FAQs',
          relatedTitle1: 'Related',
          relatedTitle2: 'Guides',
          relatedSubtitle: 'Continue with these closely related topics for deeper practical coverage.',
          read: 'Read guide'
        };

  return (
    <main style={{paddingTop: 100, paddingBottom: 72}}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(articleSchema)}}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: JSON.stringify(relatedListSchema)}}
      />
      <section className="section-spacing" style={{paddingTop: 24}}>
        <div className="container-studio" style={{maxWidth: 900}}>
          <p style={{marginBottom: 18}}>
            <Link href="/guides" style={{color: 'var(--gold-light)', textDecoration: 'none'}}>
              {text.back}
            </Link>
          </p>

          <article className="studio-card">
            <h1 className="title-elegant" style={{fontSize: '2.5rem', marginBottom: 14}}>
              {guide.copy.title}
            </h1>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20}}>
              Updated: {guide.updatedAt}
            </p>
            <p style={{color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: 24}}>{guide.copy.intro}</p>

            {guide.copy.sections.map((section) => (
              <section key={section.heading} style={{marginBottom: 28}}>
                <h2 style={{fontSize: '1.35rem', color: 'var(--gold-primary)', marginBottom: 12}}>{section.heading}</h2>
                <ul style={{paddingLeft: 22, color: 'var(--text-secondary)', lineHeight: 1.8}}>
                  {section.points.map((point) => (
                    <li key={point} style={{marginBottom: 8}}>
                      {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section>
              <h2 style={{fontSize: '1.35rem', color: 'var(--gold-primary)', marginBottom: 12}}>{text.faq}</h2>
              <div style={{display: 'grid', gap: 14}}>
                {guide.copy.faqs.map((item) => (
                  <details key={item.question} className="floating-card" style={{padding: '1rem 1.25rem'}}>
                    <summary style={{cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 600}}>
                      {item.question}
                    </summary>
                    <p style={{marginTop: 10, color: 'var(--text-secondary)', lineHeight: 1.8}}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section style={{marginTop: 34}}>
              <h2 className="title-elegant" style={{fontSize: '2rem', marginBottom: 10}}>
                {text.relatedTitle1} <span className="title-gold">{text.relatedTitle2}</span>
              </h2>
              <p style={{color: 'var(--text-muted)', marginBottom: 18}}>{text.relatedSubtitle}</p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14}}>
                {relatedGuides.map((item) => (
                  <article className="floating-card" style={{padding: '1rem 1.1rem'}} key={item.slug}>
                    <h3 style={{fontSize: '1rem', color: 'var(--champagne)', marginBottom: 8}}>{item.copy.title}</h3>
                    <p style={{color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 12}}>{item.copy.description}</p>
                    <Link href={`/guides/${item.slug}`} style={{color: 'var(--gold-light)', textDecoration: 'none'}}>
                      {text.read}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
