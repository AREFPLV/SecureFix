import { Link, Navigate, useParams } from 'react-router-dom'
import { site, LIFECYCLE_ROUTE } from '@/data/content'
import {
  getIndustrySolution,
  industrySolutionRoute,
  industrySolutions,
} from '@/data/industrySolutions'
import { getIndustrySolutionSeo } from '@/data/businessSeoExtras'
import BusinessHeroPromo from '@/components/BusinessHeroPromo'
import { usePageSeo } from '@/hooks/usePageSeo'
import { localBusinessJsonLd } from '@/data/seo'
import './Procurement.css'
import './IndustrySolution.css'
import './BusinessItHero.css'
import '@/components/Hero.css'

export default function IndustrySolutionPage() {
  const { industrySlug } = useParams<{ industrySlug: string }>()
  const industry = getIndustrySolution(industrySlug)
  const seoExtra = getIndustrySolutionSeo(industrySlug)

  usePageSeo(
    industry
      ? {
          title: industry.title,
          description: seoExtra?.executiveSummary ?? industry.description,
          path: industrySolutionRoute(industry.slug),
          keywords: industry.keywords,
          image: industry.image,
          jsonLd: [
            localBusinessJsonLd(),
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: `${industry.h1} IT Support`,
              serviceType: 'Business IT support',
              description: seoExtra?.executiveSummary ?? industry.description,
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
      <section className="hero page-hero" aria-label={industry.h1}>
        <div className="hero-bg" />
        <div className="container hero-layout">
          <div className="hero-content">
            <p className="hero-eyebrow">
              <Link to={LIFECYCLE_ROUTE} className="industry-back-link">
                ← Business IT
              </Link>
              {' · '}
              Industry solution
            </p>
            <h1>
              <span className="hero-line">{industry.h1}</span>
              <span className="hero-line accent">{industry.accent}</span>
            </h1>
            <p className="hero-subtitle">{industry.intro}</p>
            <div className="hero-actions">
              <Link to={`${LIFECYCLE_ROUTE}#quote`} className="btn btn-primary btn-shiny">
                Request a Quote
              </Link>
              <a href={`${site.phoneHref}`} className="btn btn-secondary btn-shiny">
                Call {site.phone}
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>Sector-fit IT</strong>
                <span>Devices matched to how you work</span>
              </div>
              <div className="hero-stat">
                <strong>London based</strong>
                <span>Source · deploy · support · recycle</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <BusinessHeroPromo
              variant="industry"
              industrySlug={industry.slug}
              label={`${industry.h1} IT`}
              slides={[
                {
                  tag: industry.shortLabel,
                  title: `${industry.h1} IT`,
                  subtitle: 'Devices matched to how your sector works',
                },
                {
                  tag: 'SecureFix',
                  title: 'Source · Deploy · Support',
                  subtitle: 'Practical lifecycle cover for London teams',
                },
                {
                  tag: 'Get A Plan',
                  title: 'Request A Quote',
                  subtitle: 'Tell us your sites, headcount and devices',
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
