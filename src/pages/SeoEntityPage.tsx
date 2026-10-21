import { Link } from 'react-router-dom'
import { site, BOOKING_ROUTE } from '@/data/content'
import { localCoverage } from '@/data/localCoverage'
import { usePageSeo } from '@/hooks/usePageSeo'
import { localBusinessJsonLd, repairServiceJsonLd } from '@/data/seo'
import type { SeoPageEntry } from '@/data/seoCatalog'
import './ServiceLanding.css'

type Props = {
  page: SeoPageEntry
}

export default function SeoEntityPage({ page }: Props) {
  usePageSeo({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: `${page.h1}, ${page.accent || 'SecureFix'}, London repair, EC1V, Old Street`,
    image: '/images/repair-banner.png',
    jsonLd: [
      localBusinessJsonLd(),
      repairServiceJsonLd({
        name: page.h1,
        serviceType: page.h1,
        description: page.description,
        path: page.path,
      }),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://securefix.uk/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.h1,
            item: `https://securefix.uk${page.path}`,
          },
        ],
      },
    ],
  })

  return (
    <div className="service-landing-page site-page">
      <section className="service-landing-hero site-hero-bg">
        <div className="container service-landing-hero-inner">
          <p className="service-landing-eyebrow">SecureFix · {localCoverage.addressLine}</p>
          <h1>
            {page.h1} {page.accent ? <span className="accent">{page.accent}</span> : null}
          </h1>
          <p>{page.description}</p>
          <div className="service-landing-actions">
            <Link to={page.ctaPath || BOOKING_ROUTE} className="btn btn-primary btn-shiny">
              {page.ctaLabel || 'Book Repair'}
            </Link>
            <a href={`${site.phoneHref}`} className="btn btn-secondary">
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>

      <main className="service-landing-main">
        <div className="container">
          <section className="service-landing-section">
            <h2>
              About This <span className="accent">Service</span>
            </h2>
            {page.intro.map((para) => (
              <p key={para.slice(0, 40)} className="service-landing-lead">
                {para}
              </p>
            ))}
          </section>

          {page.bullets && page.bullets.length > 0 ? (
            <section className="service-landing-section">
              <h2>
                What We <span className="accent">Cover</span>
              </h2>
              <ul className="service-landing-checklist">
                {page.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="service-landing-section">
            <h2>
              Areas We <span className="accent">Serve</span>
            </h2>
            <p className="service-landing-lead">
              Visit SecureFix at <strong>{localCoverage.addressLine}</strong> or book collection nearby.
            </p>
            <div className="service-landing-tags">
              {localCoverage.neighborhoods.map((place) => (
                <span key={place}>{place}</span>
              ))}
            </div>
          </section>

          {page.relatedPaths && page.relatedPaths.length > 0 ? (
            <nav className="service-landing-related" aria-label="Related pages">
              <h2>
                Related <span className="accent">Pages</span>
              </h2>
              <div className="service-landing-related-links">
                {page.relatedPaths.map((link) => (
                  <Link key={link.path} to={link.path}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
        </div>
      </main>
    </div>
  )
}
