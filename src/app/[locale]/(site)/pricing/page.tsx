import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import type {AppLocale} from '@/i18n/routing';
import {
  getDefaultSocialImage,
  getLocaleAlternates,
  getLocalizedUrl,
  getOpenGraphAlternateLocales,
  getOpenGraphLocale
} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: {locale: AppLocale};
}): Promise<Metadata> {
  const {locale} = params;
  const [seo, pricing] = await Promise.all([
    getTranslations({locale, namespace: 'SEO'}),
    getTranslations({locale, namespace: 'Pricing'})
  ]);
  const socialImage = getDefaultSocialImage();
  const canonical = getLocalizedUrl(locale, '/pricing');
  const languages = getLocaleAlternates('/pricing');
  const title = `${pricing('title1')} ${pricing('title2')} | ${seo('siteName')}`;
  const description = pricing('subtitle');

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
      follow: true
    }
  };
}

export default async function PricingPage() {
  const t = await getTranslations('Pricing');
  const plans = [
    {key: 'free', icon: 'fa-seedling', featured: false},
    {key: 'monthly', icon: 'fa-bolt', featured: false},
    {key: 'yearly', icon: 'fa-crown', featured: true}
  ] as const;
  const faqItems = t.raw('faqItems') as {q: string; a: string}[];

  return (
    <main style={{paddingTop: 80}}>
      <section className="section-spacing">
        <div className="container-studio" style={{maxWidth: 1100}}>
          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <h1 className="title-elegant" style={{fontSize: '3.5rem', marginBottom: '1rem'}}>
              {t('title1')} <span className="title-gold">&</span> {t('title2')}
            </h1>
            <p className="subtitle-elegant">{t('subtitle')}</p>
            <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem'}}>{t('lastUpdated')}</p>
          </div>

          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <h2 className="title-elegant" style={{fontSize: '2rem', color: 'var(--gold-primary)', marginBottom: '0.75rem'}}>
              {t('plansTitle')}
            </h2>
            <p style={{color: 'var(--text-secondary)'}}>{t('plansSubtitle')}</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={plan.featured ? 'floating-card' : 'studio-card'}
                style={{padding: '2rem', position: 'relative'}}
              >
                {plan.featured ? (
                  <span
                    className="badge-gold"
                    style={{position: 'absolute', top: 20, right: 20, fontSize: '0.75rem', padding: '0.35rem 0.65rem'}}
                  >
                    {t(`${plan.key}.badge`)}
                  </span>
                ) : null}
                <h3 style={{color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem'}}>
                  <i className={`fas ${plan.icon}`} style={{marginRight: '0.5rem', color: 'var(--gold-primary)'}} />
                  {t(`${plan.key}.name`)}
                </h3>
                <p style={{color: 'var(--gold-primary)', fontWeight: 800, fontSize: '2rem', marginBottom: '1rem'}}>
                  {t(`${plan.key}.price`)}
                  <span style={{fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem'}}>
                    {t(`${plan.key}.period`)}
                  </span>
                </p>
                <ul style={{listStyle: 'disc', marginLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8}}>
                  {(t.raw(`${plan.key}.items`) as string[]).map((x, idx) => (
                    <li key={idx} style={{marginBottom: '0.4rem'}}>
                      {x}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/create"
                  className={plan.featured ? 'btn-gold' : 'btn-outline-gold'}
                  style={{display: 'inline-flex', marginTop: '1.25rem'}}
                >
                  {t(`${plan.key}.cta`)}
                </Link>
              </div>
            ))}
          </div>

          <div className="studio-card" style={{marginBottom: '2rem'}}>
            <h2 className="title-elegant" style={{fontSize: '2rem', color: 'var(--gold-primary)', marginBottom: '1.25rem'}}>
              <i className="fas fa-coins" style={{marginRight: '0.75rem'}} />
              {t('commonTitle')}
            </h2>
            <ul style={{listStyle: 'disc', marginLeft: '2rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 0}}>
              {(t.raw('commonItems') as string[]).map((x, idx) => (
                <li key={idx} style={{marginBottom: '0.5rem'}}>
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="studio-card" style={{marginBottom: '2rem'}}>
            <h2 className="title-elegant" style={{fontSize: '2rem', color: 'var(--gold-primary)', marginBottom: '1.25rem'}}>
              <i className="fas fa-circle-question" style={{marginRight: '0.75rem'}} />
              {t('faqTitle')}
            </h2>
            <div style={{color: 'var(--text-secondary)', lineHeight: 1.8}}>
              {faqItems.map((item, idx) => (
                <div key={idx} style={{marginBottom: idx === faqItems.length - 1 ? 0 : '1.25rem'}}>
                  <h3 style={{color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.4rem'}}>
                    {item.q}
                  </h3>
                  <p style={{marginBottom: 0}}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="floating-card" style={{padding: '2rem', textAlign: 'center'}}>
            <h3 style={{color: 'var(--gold-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem'}}>
              {t('ctaTitle')}
            </h3>
            <p style={{color: 'var(--text-secondary)', marginBottom: '1.25rem'}}>{t('ctaSubtitle')}</p>
            <div style={{display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link href="/create" className="btn-gold">
                {t('ctaPrimary')}
              </Link>
              <Link href="/privacy" className="btn-outline-gold">
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
