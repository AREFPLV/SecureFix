import { Link, Navigate, useParams } from 'react-router-dom'
import { site, LIFECYCLE_ROUTE } from '@/data/content'
import {
  getIndustrySolution,
  industrySolutionRoute,
  industrySolutions,
} from '@/data/industrySolutions'
import { usePageSeo } from '@/hooks/usePageSeo'
import { localBusinessJsonLd } from '@/data/seo'
import './Procurement.css'
import './IndustrySolution.css'

export default function IndustrySolutionPage() {
  const { industrySlug } = useParams<{ industrySlug: string }>()
  const industry = getIndustrySolution(industrySlug)

  usePageSeo(
    industry
      ? {
          title: industry.title,
          description: industry.description,
          path: industrySolutionRoute(industry.slug),
          keywords: industry.keywords,
          image: '/images/business-it-hero.png',
          jsonLd: [
            localBusinessJsonLd(),
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: `${industry.h1} IT Support`,
              serviceType: 'Business IT support',
              description: industry.description,
              provider: {
                '@type': 'LocalBusiness',
                name: site.name,
                url: `https://${site.website}`,
              },
              areaServed: 'London',
              url: `https://${site.website}${industrySolutionRoute(industry.slug)}`,
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
                  name: industry.h1,
                  item: `https://${site.website}${industrySolutionRoute(industry.slug)}`,
                },
              ],
            },
          ],
        }
      : {
          title: 'Business IT Solutions | SecureFix',
          description: 'Industry IT support solutions from SecureFix London.',
          path: LIFECYCLE_ROUTE,
        },
  )

  if (!industry) {
    return <Navigate to={LIFECYCLE_ROUTE} replace />
  }

  const related = industrySolutions.filter((item) => item.slug !== industry.slug).slice(0, 6)

  return (
    <div className="procurement-page industry-solution-page site-page">
      <section className="procurement-hero procurement-hero-photo procurement-hero-align-left" aria-label={industry.h1}>
        <div className="procurement-hero-media" aria-hidden="true">
          <img src="/images/business-it-hero.png" alt="" className="procurement-hero-img" />
          <div
            className="procurement-hero-blur"
            style={{ backgroundImage: 'url(/images/business-it-hero.png)' }}
          />
          <div className="procurement-hero-shade" />
        </div>
        <div className="container procurement-hero-inner procurement-hero-inner-photo">
          <div className="procurement-hero-copy">
            <p className="procurement-eyebrow">
              <Link to={LIFECYCLE_ROUTE} className="industry-back-link">
                ← Business IT
              </Link>
              {' · '}
              Solutions we provide
            </p>
            <h1>
              {industry.h1} <span className="accent">{industry.accent}</span>
            </h1>
            <p>{industry.intro}</p>
            <div className="procurement-hero-actions">
              <Link to={`${LIFECYCLE_ROUTE}#quote`} className="btn btn-primary btn-shiny">
                Request a Quote
              </Link>
              <a href={`${site.phoneHref}`} className="btn btn-secondary procurement-hero-btn-outline">
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="procurement-main">
        <div className="container">
          <section className="procurement-section">
            <h2>
              Challenges we <span className="accent">solve</span>
            </h2>
            <div className="procurement-grid">
              {industry.challenges.map((item) => (
                <article key={item.title} className="procurement-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="procurement-section">
            <h2>
              How SecureFix can <span className="accent">help</span>
            </h2>
            <div className="procurement-grid">
              {industry.howWeHelp.map((item) => (
                <article key={item.title} className="procurement-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="procurement-section procurement-split">
            <div>
              <h2>
                Services for <span className="accent">{industry.shortLabel}</span>
              </h2>
              <ul className="procurement-checklist">
                {industry.services.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>
                Results you can <span className="accent">expect</span>
              </h2>
              <ul className="procurement-checklist">
                {industry.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="procurement-section">
            <h2>
              Other industries we <span className="accent">support</span>
            </h2>
            <div className="industry-solution-tags">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={industrySolutionRoute(item.slug)}
                  className="industry-solution-tag"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="procurement-cta">
            <div>
              <h2>Need IT support for {industry.shortLabel.toLowerCase()}?</h2>
              <p>
                Tell us about your sites, team size and devices. SecureFix will recommend a practical
                support plan for London.
              </p>
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
