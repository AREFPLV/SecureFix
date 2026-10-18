import { Link } from 'react-router-dom'
import { site, BOOKING_ROUTE } from '@/data/content'
import { PRIVACY_ROUTE } from '@/data/privacy'
import { termsContent } from '@/data/terms'
import { usePageSeo } from '@/hooks/usePageSeo'
import './About.css'

export default function Terms() {
  usePageSeo({
    title: 'Terms & Conditions | SecureFix',
    description:
      'Terms for SECUREFIX LTD repairs, including the 2-year repair warranty. Liquid damage is excluded.',
    path: '/terms',
  })

  return (
    <div className="about-page site-page">
      <div className="about-hero site-hero-bg">
        <div className="container">
          <h1>
            Terms &amp; <span className="accent">Conditions</span>
          </h1>
          <p>Last updated {termsContent.lastUpdated}</p>
        </div>
      </div>

      <main className="about-main">
        <div className="container">
          <section className="about-section">
            <p className="about-text">{termsContent.intro}</p>
            <p className="about-text">
              Read how we handle personal details in the <Link to={PRIVACY_ROUTE}>privacy policy</Link>.
            </p>
          </section>

          {termsContent.sections.map((section) => (
            <section key={section.title} className="about-section">
              <h2>{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="about-text">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section className="about-cta">
            <h2>Questions about these terms?</h2>
            <p>Contact SecureFix and we will be happy to help.</p>
            <div className="about-cta-actions">
              <a href={`mailto:${site.email}`} className="btn btn-primary btn-shiny">
                Email {site.email}
              </a>
              <a href={`${site.phoneHref}`} className="btn btn-secondary btn-shiny">
                Call {site.phone}
              </a>
              <Link to={BOOKING_ROUTE} className="btn btn-secondary btn-shiny">
                Book Repair
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
