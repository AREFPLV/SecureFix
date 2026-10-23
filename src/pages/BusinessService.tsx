import { Link, Navigate, useParams } from 'react-router-dom'
import { site, LIFECYCLE_ROUTE } from '@/data/content'
import { getBusinessService, businessServiceRoute } from '@/data/businessServices'
import { getSeoPageByPath } from '@/data/seoCatalog'
import BusinessHeroArt, { businessHeroVariantFromSlug } from '@/components/BusinessHeroArt'
import { usePageSeo } from '@/hooks/usePageSeo'
import './Procurement.css'
import './BusinessHeroLayout.css'

const lifecycleApproach = [
  {
    label: 'Sourcing',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Procurement',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 5h2l1.2 9.5a1.5 1.5 0 0 0 1.5 1.3h8.6a1.5 1.5 0 0 0 1.5-1.2L20 8H7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.3" fill="currentColor" />
        <circle cx="17" cy="20" r="1.3" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Deployment',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 16V8h11v8H3zm11 0h4l3 3v-5h-7v2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="18.5" r="1.5" fill="currentColor" />
        <circle cx="16.5" cy="18.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Recycling',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 8l2-3h6l2 3M7 8H4l3 10h4M17 8h3l-3 10h-4M10 18l2 3 2-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function BusinessService() {
  const { serviceSlug } = useParams<{ serviceSlug: string }>()
  const service = serviceSlug ? getBusinessService(serviceSlug) : undefined
  const seo = serviceSlug ? getSeoPageByPath(businessServiceRoute(serviceSlug)) : undefined
  usePageSeo({
    title: seo?.title ?? 'Business IT | SecureFix',
    description: seo?.description ?? 'SecureFix business IT services in London.',
    path: seo?.path ?? LIFECYCLE_ROUTE,
  })

  if (!service) {
    return <Navigate to={LIFECYCLE_ROUTE} replace />
  }

  const photoHero = Boolean(service.hero.image)
  const heroAlign = service.hero.align === 'right' ? 'right' : 'left'

  return (
    <div className="procurement-page site-page">
      <section
        className={`procurement-hero${photoHero ? ' procurement-hero-photo' : ' site-hero-bg'}${
          photoHero ? ` procurement-hero-align-${heroAlign}` : ''
        }`}
        aria-label={service.cardTitle}
      >
        {service.hero.image ? (
          <div className="procurement-hero-media" aria-hidden="true">
            <img src={service.hero.image} alt="" className="procurement-hero-img" />
            <div
              className="procurement-hero-blur"
              style={{ backgroundImage: `url(${service.hero.image})` }}
            />
            <div className="procurement-hero-shade" />
          </div>
        ) : null}

        <div
          className={`container procurement-hero-inner procurement-hero-inner-widget${
            photoHero ? ' procurement-hero-inner-photo' : ''
          }`}
        >
          <aside className="procurement-hero-widget business-hero-widget" aria-label="Business IT animation">
            <BusinessHeroArt variant={businessHeroVariantFromSlug(service.slug)} />
          </aside>

          <div className="procurement-hero-content">
            <div className="procurement-hero-copy">
              <p className="procurement-eyebrow">
                {service.hero.eyebrow || `${service.icon} SecureFix for Business`}
              </p>
              <h1>
                {service.hero.title}{' '}
                <span className="accent">{service.hero.accent}</span>
              </h1>
              <p>{service.hero.subtitle}</p>
              <div className="procurement-hero-actions">
                {photoHero ? (
                  <>
                    <a href={`${site.phoneHref}`} className="btn btn-primary btn-shiny">
                      Talk to an IT Specialist
                    </a>
                    <Link to={`${LIFECYCLE_ROUTE}#quote`} className="btn btn-secondary procurement-hero-btn-outline">
                      Request a Quote
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={`${LIFECYCLE_ROUTE}#quote`} className="btn btn-primary btn-shiny">
                      Request a Quote
                    </Link>
                    <a href={`${site.phoneHref}`} className="btn btn-secondary">
                      Call {site.phone}
                    </a>
                  </>
                )}
              </div>
            </div>

            {photoHero ? (
              <div className="procurement-lifecycle-strip">
                <span className="procurement-lifecycle-label">Our Full Lifecycle Approach</span>
                <ol className="procurement-lifecycle-steps">
                  {lifecycleApproach.map((step) => (
                    <li key={step.label}>
                      <span className="procurement-lifecycle-icon">{step.icon}</span>
                      <span className="procurement-lifecycle-name">{step.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <main className="procurement-main">
        <div className="container">
          <section className="procurement-section">
            <h2>
              What Is This <span className="accent">Service?</span>
            </h2>
            <p className="procurement-lead">{service.whatIsIt}</p>
            <p className="procurement-lead">{service.intro}</p>
          </section>

          <section className="procurement-section">
            <h2>
              What We <span className="accent">Provide</span>
            </h2>
            <div className="procurement-grid">
              {service.whatWeDo.map((item) => (
                <article key={item.title} className="procurement-card">
                  <span>{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="procurement-section">
            <h2>
              Key <span className="accent">Focus Areas</span>
            </h2>
            <div className="procurement-brands">
              {service.highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          <section className="procurement-section procurement-split">
            <div>
              <h2>
                Who It Is <span className="accent">For</span>
              </h2>
              <ul className="procurement-checklist">
                {service.whoFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>
                How It <span className="accent">Works</span>
              </h2>
              <div className="procurement-process">
                {service.process.map((step) => (
                  <article key={step.step} className="procurement-process-step">
                    <strong>{step.step}</strong>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="procurement-cta">
            <div>
              <span className="procurement-cta-icon">{service.icon}</span>
              <h2>{service.ctaTitle}</h2>
              <p>{service.ctaText}</p>
            </div>
            <div className="procurement-cta-actions">
              <Link to={`${LIFECYCLE_ROUTE}#quote`} className="btn btn-primary btn-shiny">
                Request a Quote
              </Link>
              <a href={`${site.phoneHref}`} className="btn btn-secondary">
                Call {site.phone}
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
