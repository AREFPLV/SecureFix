import { Link } from 'react-router-dom'
import { usePageSeo } from '@/hooks/usePageSeo'
import { getSeoCatalog } from '@/data/seoCatalog'
import { repairTree } from '@/data/issueCatalog'
import './ServiceLanding.css'

export default function HtmlSitemap() {
  const catalog = getSeoCatalog()
  const tree = repairTree()
  usePageSeo({
    title: 'HTML Sitemap | SecureFix London',
    description:
      'Browse SecureFix repair, product, business IT and recycling pages, grouped by device.',
    path: '/sitemap',
  })

  const groups = [
    { title: 'Core pages', pages: catalog.filter((page) => page.kind === 'static') },
    { title: 'Products and accessories', pages: catalog.filter((page) => page.kind === 'product') },
    { title: 'Business IT', pages: catalog.filter((page) => page.kind === 'business') },
    { title: 'Recycling topics', pages: catalog.filter((page) => page.kind === 'recycling-topic') },
  ]

  return (
    <div className="service-landing-page site-page">
      <section className="service-landing-hero site-hero-bg">
        <div className="container service-landing-hero-inner">
          <h1>
            SecureFix <span className="accent">Sitemap</span>
          </h1>
          <p>Repair links are grouped by category, brand and model.</p>
        </div>
      </section>
      <main className="service-landing-main">
        <div className="container">
          {groups.map((group) =>
            group.pages.length ? (
              <section key={group.title} className="service-landing-section">
                <h2>{group.title}</h2>
                <ul className="sitemap-tree">
                  {group.pages.map((page) => (
                    <li key={page.path}>
                      <Link to={page.path}>{page.h1}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null,
          )}
          <section className="service-landing-section">
            <h2>Repairs</h2>
            {tree.map((category) => (
              <section key={category.id}>
                <h3>
                  <Link to={category.path}>{category.label}</Link>
                </h3>
                {category.brands.map((brand) => (
                  <div key={brand.path}>
                    <h4>
                      <Link to={brand.path}>{brand.label}</Link>
                    </h4>
                    <ul className="sitemap-tree">
                      {brand.models.map((model) => (
                        <li key={model.path}>
                          <Link to={model.path}>{model.label} repair</Link>
                          {model.issues.length ? (
                            <ul>
                              {model.issues.map((issue) => (
                                <li key={issue.path}>
                                  <Link to={issue.path}>{issue.label}</Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
