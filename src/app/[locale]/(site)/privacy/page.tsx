import {getTranslations} from 'next-intl/server';

export default async function PrivacyPage() {
  const t = await getTranslations('Privacy');

  return (
    <main style={{paddingTop: 80}}>
      <section className="section-spacing">
        <div className="container-studio" style={{maxWidth: 900}}>
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h1 className="title-elegant" style={{fontSize: '3.5rem', marginBottom: '1rem'}}>
              {t('title1')} <span className="title-gold">&</span> {t('title2')}
            </h1>
            <p className="subtitle-elegant">{t('subtitle')}</p>
            <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem'}}>
              {t('lastUpdated')}
            </p>
          </div>

          <div className="studio-card" style={{marginBottom: '2rem'}}>
            <h2 className="title-elegant" style={{fontSize: '2rem', color: 'var(--gold-primary)', marginBottom: '2rem'}}>
              <i className="fas fa-shield-alt" style={{marginRight: '0.75rem'}} />
              {t('privacyTitle')}
            </h2>

            <div style={{color: 'var(--text-secondary)', lineHeight: 1.8}}>
              <h3 style={{color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem'}}>
                {t('p1Title')}
              </h3>
              <ul style={{listStyle: 'disc', marginLeft: '2rem', marginBottom: '2rem'}}>
                {t.raw('p1Items').map((x: string, idx: number) => (
                  <li key={idx} style={{marginBottom: '0.5rem'}}>
                    {x}
                  </li>
                ))}
              </ul>

              <h3 style={{color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem'}}>
                {t('p2Title')}
              </h3>
              <ul style={{listStyle: 'disc', marginLeft: '2rem', marginBottom: '2rem'}}>
                {t.raw('p2Items').map((x: string, idx: number) => (
                  <li key={idx} style={{marginBottom: '0.5rem'}}>
                    {x}
                  </li>
                ))}
              </ul>

              <h3 style={{color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem'}}>
                {t('p3Title')}
              </h3>
              <ul style={{listStyle: 'disc', marginLeft: '2rem', marginBottom: '0.5rem'}}>
                {t.raw('p3Items').map((x: string, idx: number) => (
                  <li key={idx} style={{marginBottom: '0.5rem'}}>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="studio-card" style={{marginBottom: '2rem'}}>
            <h2 className="title-elegant" style={{fontSize: '2rem', color: 'var(--gold-primary)', marginBottom: '2rem'}}>
              <i className="fas fa-file-contract" style={{marginRight: '0.75rem'}} />
              {t('termsTitle')}
            </h2>

            <div style={{color: 'var(--text-secondary)', lineHeight: 1.8}}>
              <h3 style={{color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem'}}>
                {t('t1Title')}
              </h3>
              <p style={{marginBottom: '2rem'}}>{t('t1Text')}</p>

              <h3 style={{color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem'}}>
                {t('t2Title')}
              </h3>
              <ul style={{listStyle: 'disc', marginLeft: '2rem', marginBottom: '2rem'}}>
                {t.raw('t2Items').map((x: string, idx: number) => (
                  <li key={idx} style={{marginBottom: '0.5rem'}}>
                    {x}
                  </li>
                ))}
              </ul>

              <h3 style={{color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem'}}>
                {t('t3Title')}
              </h3>
              <p style={{marginBottom: '2rem'}}>{t('t3Text')}</p>

              <h3 style={{color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.25rem', marginBottom: '1rem'}}>
                {t('t4Title')}
              </h3>
              <ul style={{listStyle: 'disc', marginLeft: '2rem', marginBottom: 0}}>
                {t.raw('t4Items').map((x: string, idx: number) => (
                  <li key={idx} style={{marginBottom: '0.5rem'}}>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="floating-card" style={{padding: '2rem', textAlign: 'center'}}>
            <h3 style={{color: 'var(--gold-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem'}}>
              <i className="fas fa-envelope" /> {t('contactTitle')}
            </h3>
            <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>{t('contactSubtitle')}</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center'}}>
              <a
                href="mailto:privacy@luminastudio.com"
                style={{color: 'var(--gold-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
              >
                <i className="fas fa-envelope" />
                privacy@luminastudio.com
              </a>
              <a
                href="mailto:support@luminastudio.com"
                style={{color: 'var(--gold-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
              >
                <i className="fas fa-headset" />
                support@luminastudio.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

