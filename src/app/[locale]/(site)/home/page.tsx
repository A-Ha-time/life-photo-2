import {getTranslations} from 'next-intl/server';

import {Link} from '@/i18n/navigation';

export default async function HomePage() {
  const t = await getTranslations('Home');

  return (
    <main>
      {/* Hero Section */}
      <section
        className="photo-studio-bg vignette"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1920&h=1080&fit=crop')",
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginTop: 80
        }}
      >
        <div className="container-studio" style={{position: 'relative', zIndex: 10, textAlign: 'center'}}>
          <div className="animate-fade-in-up">
            <div
              className="inline-flex items-center gap-3 px-6 py-3 floating-card rounded-full mb-8"
              style={{display: 'inline-flex', alignItems: 'center', gap: '0.75rem'}}
            >
              <i className="fas fa-sparkles" style={{color: 'var(--gold-primary)', fontSize: '1.25rem'}} />
              <span style={{color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600}}>
                {t('badge')}
              </span>
            </div>
          </div>

          <h1
            className="title-elegant animate-fade-in-up delay-100"
            style={{
              fontSize: '5rem',
              marginBottom: '1.5rem',
              opacity: 0,
              animationFillMode: 'forwards'
            }}
          >
            {t('titleLine1')}
            <br />
            <span className="title-gold">{t('titleLine2')}</span>
          </h1>

          <p
            className="subtitle-elegant animate-fade-in-up delay-200"
            style={{
              fontSize: '1.5rem',
              maxWidth: 700,
              margin: '0 auto 3rem',
              opacity: 0,
              animationFillMode: 'forwards'
            }}
          >
            {t('subtitle')}
          </p>

          <div
            className="animate-fade-in-up delay-300"
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              opacity: 0,
              animationFillMode: 'forwards'
            }}
          >
            <Link
              href="/create"
              className="btn-gold"
              style={{display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none'}}
            >
              <i className="fas fa-magic" />
              {t('ctaPrimary')}
            </Link>
            <button
              className="btn-outline-gold"
              style={{display: 'inline-flex', alignItems: 'center', gap: '0.75rem'}}
              type="button"
            >
              <i className="fas fa-play-circle" />
              {t('ctaSecondary')}
            </button>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up delay-400"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '3rem',
              maxWidth: 800,
              margin: '5rem auto 0',
              opacity: 0,
              animationFillMode: 'forwards'
            }}
          >
            <div style={{textAlign: 'center'}}>
              <div className="title-gold" style={{fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem'}}>
                50K+
              </div>
              <div style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>{t('statPhotos')}</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div className="title-gold" style={{fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem'}}>
                10K+
              </div>
              <div style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>{t('statUsers')}</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div className="title-gold" style={{fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem'}}>
                4.9
              </div>
              <div style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>{t('statRating')}</div>
            </div>
          </div>
        </div>

        <div style={{position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)'}}>
          <i className="fas fa-chevron-down bounce-gold" style={{color: 'var(--gold-primary)', fontSize: '2rem'}} />
        </div>
      </section>

      {/* Service process */}
      <section className="section-spacing" style={{background: 'var(--bg-secondary)'}}>
        <div className="container-studio">
          <div style={{textAlign: 'center', marginBottom: '5rem'}}>
            <h2 className="title-elegant" style={{fontSize: '3.5rem', marginBottom: '1rem'}}>
              {t('flowTitle1')} <span className="title-gold">{t('flowTitle2')}</span>
            </h2>
            <p className="subtitle-elegant">{t('flowSubtitle')}</p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem'}}>
            {[
              {icon: 'fa-upload', title: t('step1Title'), desc: t('step1Desc')},
              {icon: 'fa-palette', title: t('step2Title'), desc: t('step2Desc')},
              {icon: 'fa-wand-magic-sparkles', title: t('step3Title'), desc: t('step3Desc')},
              {icon: 'fa-download', title: t('step4Title'), desc: t('step4Desc')}
            ].map((s, idx) => (
              <div className="studio-card" style={{textAlign: 'center'}} key={idx}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 1.5rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-light))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  <i className={`fas ${s.icon}`} style={{fontSize: '2rem', color: 'var(--bg-primary)'}} />
                </div>
                <h3 className="title-elegant" style={{fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--gold-primary)'}}>
                  {String(idx + 1).padStart(2, '0')}. {s.title}
                </h3>
                <p style={{color: 'var(--text-secondary)', lineHeight: 1.8}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo wall */}
      <section className="section-spacing" style={{background: 'var(--bg-primary)'}}>
        <div className="container-studio">
          <div style={{textAlign: 'center', marginBottom: '5rem'}}>
            <h2 className="title-elegant" style={{fontSize: '3.5rem', marginBottom: '1rem'}}>
              <span className="title-gold">{t('galleryTitle1')}</span> {t('galleryTitle2')}
            </h2>
            <p className="subtitle-elegant">{t('gallerySubtitle')}</p>
          </div>

          <div className="photo-wall">
            {[
              {
                img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=800&fit=crop',
                title: t('galleryItem1Title'),
                icon: 'fa-mountain',
                cat: t('galleryItem1Cat')
              },
              {
                img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=800&fit=crop',
                title: t('galleryItem2Title'),
                icon: 'fa-water',
                cat: t('galleryItem2Cat')
              },
              {
                img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=800&fit=crop',
                title: t('galleryItem3Title'),
                icon: 'fa-flag-checkered',
                cat: t('galleryItem3Cat')
              },
              {
                img: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop',
                title: t('galleryItem4Title'),
                icon: 'fa-snowflake',
                cat: t('galleryItem4Cat')
              },
              {
                img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=800&fit=crop',
                title: t('galleryItem5Title'),
                icon: 'fa-plane',
                cat: t('galleryItem5Cat')
              },
              {
                img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
                title: t('galleryItem6Title'),
                icon: 'fa-star',
                cat: t('galleryItem6Cat')
              }
            ].map((item, i) => (
              <div className="photo-wall-item glow-gold-hover" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.img} alt={item.cat} />
                <div className="photo-wall-overlay">
                  <div className="photo-wall-title">{item.title}</div>
                  <div className="photo-wall-category">
                    <i className={`fas ${item.icon}`} />
                    {item.cat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-spacing" style={{background: 'var(--bg-secondary)'}}>
        <div className="container-studio">
          <div style={{textAlign: 'center', marginBottom: '5rem'}}>
            <h2 className="title-elegant" style={{fontSize: '3.5rem', marginBottom: '1rem'}}>
              {t('testimonialsTitle1')} <span className="title-gold">{t('testimonialsTitle2')}</span>
            </h2>
            <p className="subtitle-elegant">{t('testimonialsSubtitle')}</p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem'}}>
            {[
              {
                avatar:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                name: t('review1Name'),
                text: t('review1Text')
              },
              {
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                name: t('review2Name'),
                text: t('review2Text')
              },
              {
                avatar:
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                name: t('review3Name'),
                text: t('review3Text')
              }
            ].map((r, i) => (
              <div className="studio-card" key={i}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.avatar}
                    alt={r.name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      border: '2px solid var(--gold-primary)'
                    }}
                  />
                  <div>
                    <div style={{fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem'}}>
                      {r.name}
                    </div>
                    <div style={{display: 'flex', gap: '0.25rem'}}>
                      {Array.from({length: 5}).map((_, idx) => (
                        <i className="fas fa-star" style={{color: 'var(--gold-primary)'}} key={idx} />
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{color: 'var(--text-secondary)', lineHeight: 1.8, fontStyle: 'italic'}}>
                  “{r.text}”
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="section-spacing photo-studio-bg"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&h=600&fit=crop')",
          position: 'relative'
        }}
      >
        <div className="container-studio" style={{position: 'relative', zIndex: 10, textAlign: 'center'}}>
          <div className="floating-card glow-gold" style={{maxWidth: 900, margin: '0 auto', padding: '4rem'}}>
            <h2 className="title-elegant" style={{fontSize: '3rem', marginBottom: '1.5rem'}}>
              {t('ctaTitle1')}
              <span className="title-gold">{t('ctaTitle2')}</span>
              {t('ctaTitle3')}
            </h2>
            <p className="subtitle-elegant" style={{marginBottom: '2.5rem'}}>
              {t('ctaSubtitle')}
            </p>
            <Link
              href="/create"
              className="btn-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                fontSize: '1.125rem'
              }}
            >
              <i className="fas fa-rocket" />
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bounceGold {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .bounce-gold { animation: bounceGold 2s infinite; }
      `}</style>
    </main>
  );
}

