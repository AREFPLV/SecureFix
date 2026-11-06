import { Navigate, useParams } from 'react-router-dom'
import { site, LIFECYCLE_ROUTE } from '@/data/content'
import { getBusinessService, businessServiceRoute } from '@/data/businessServices'
import { getBusinessServiceSeo } from '@/data/businessSeoExtras'
import { getSeoPageByPath } from '@/data/seoCatalog'
import { localBusinessJsonLd } from '@/data/seo'
import { businessHeroVariantFromSlug } from '@/components/BusinessHeroArt'
import BusinessHeroPromo from '@/components/BusinessHeroPromo'
import LifecycleQuoteForm from '@/components/LifecycleQuoteForm'
import { usePageSeo } from '@/hooks/usePageSeo'
import './Procurement.css'
import './BusinessItHero.css'
import '@/components/Hero.css'

function quoteServiceForSlug(slug: string): string {
  if (slug === 'procurement') return 'Laptop sourcing'
  if (slug === 'deployment') return 'Device deployment'
  if (slug === 'os-setup') return 'Configuration & imaging'
  if (slug === 'lifecycle-management') return 'Full lifecycle management'
  return 'Mixed / other'
}

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
  const seoExtra = getBusinessServiceSeo(serviceSlug)
  const servicePath = serviceSlug ? businessServiceRoute(serviceSlug) : LIFECYCLE_ROUTE

  usePageSeo({
    title: seo?.title ?? 'Business IT | SecureFix',
    description:
      seoExtra?.executiveSummary ??
      seo?.description ??
      'SecureFix business IT services in London.',
    path: seo?.path ?? servicePath,
    jsonLd: service
      ? [
          localBusinessJsonLd(),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.cardTitle,
            serviceType: 'Business IT',
            description: seoExtra?.executiveSummary ?? service.intro,
            provider: {
              '@type': 'LocalBusiness',
              name: site.name,
              url: `https://${site.website}`,
            },
            areaServed: 'London',
            url: `https://${site.website}${servicePath}`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${site.website}/` },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Business IT',
                item: `https://${site.website}${LIFECYCLE_ROUTE}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: service.cardTitle,
                item: `https://${site.website}${servicePath}`,
              },
            ],
          },
          ...(seoExtra?.faqs?.length
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: seoExtra.faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                  })),
                },
              ]
            : []),
        ]
      : undefined,
  })

  if (!service) {
    return <Navigate to={LIFECYCLE_ROUTE} replace />
  }

  const heroVariant = businessHeroVariantFromSlug(service.slug)

  return (
    <div className="procurement-page site-page">
      <section className="hero page-hero" aria-label={service.cardTitle}>
        <div className="hero-bg" />
        <div className="container hero-layout">
          <div className="hero-content">
            <p className="hero-eyebrow">
              {service.hero.eyebrow || 'SecureFix for Business'}
            </p>
            <h1>
              <span className="hero-line">{service.hero.title}</span>
              <span className="hero-line accent">{service.hero.accent}</span>
            </h1>
            <p className="hero-subtitle">{service.hero.subtitle}</p>
            <div className="hero-actions">
              <a href={`${site.phoneHref}`} className="btn btn-primary btn-shiny">
                Talk to an IT Specialist
              </a>
              <a href="#quote" className="btn btn-secondary btn-shiny">
                Request a Quote
              </a>
            </div>
            <div className="hero-stats">
              {lifecycleApproach.slice(0, 2).map((step) => (
                <div className="hero-stat" key={step.label}>
                  <strong>{step.label}</strong>
                  <span>Part of the SecureFix lifecycle</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <BusinessHeroPromo
              variant={heroVariant}
              serviceSlug={service.slug}
              label={service.cardTitle}
              slides={[
                {
                  tag: service.cardTitle,
                  title: service.hero.accent || 'Business IT',
                  subtitle: service.hero.subtitle.slice(0, 72),
                },
                {
                  tag: 'Lifecycle',
                  title: 'Source · Deploy · Support',
                  subtitle: 'One SecureFix partner for London fleets',
                },
                {
                  tag: 'Get Started',
                  title: 'Request A Quote',
                  subtitle: 'Transparent pricing for team rollouts',
                },
              ]}
            />
          </div>
        </div>
      </section>

      <main className="procurement-main">
        <div className="container">
          {seoExtra ? (
            <section className="procurement-section business-seo-block">
              <h2>
                Executive <span className="accent">summary</span>
              </h2>
              <p className="procurement-lead">{seoExtra.executiveSummary}</p>
              <div className="business-seo-grid">
                {seoExtra.ceoOutcomes.map((item) => (
                  <article key={item.title} className="business-seo-card">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

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

          {seoExtra?.faqs?.length ? (
            <section className="procurement-section business-seo-block" aria-label="Frequently asked questions">
              <h2>
                Frequently asked <span className="accent">questions</span>
              </h2>
              <div className="business-faq-list">
                {seoExtra.faqs.map((faq) => (
                  <article key={faq.question} className="business-faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="procurement-section procurement-split">
            <div>
              <h2>{service.ctaTitle}</h2>
              <p className="procurement-lead">{service.ctaText}</p>
              <p>
                Prefer to talk it through? Call{' '}
                <a href={site.phoneHref}>{site.phone}</a>.
              </p>
            </div>
            <div id="quote" className="lifecycle-quote">
              <h2>
                Request a <span className="accent">Quote</span>
              </h2>
              <LifecycleQuoteForm defaultService={quoteServiceForSlug(service.slug)} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
