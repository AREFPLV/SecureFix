import { Link, useParams } from 'react-router-dom'
import { site, RECYCLING_ROUTE } from '@/data/content'
import { recyclingContent } from '@/data/recycling'
import { getRecyclingTopic, recyclingTopicList } from '@/data/recyclingTopics'
import RecycleHeroArt from '@/components/RecycleHeroArt'
import RecyclingQuoteForm from '@/components/RecyclingQuoteForm'
import NotFound from '@/pages/NotFound'
import { usePageSeo } from '@/hooks/usePageSeo'
import { localBusinessJsonLd } from '@/data/seo'
import './Recycling.css'

export default function RecyclingTopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>()
  const topic = getRecyclingTopic(topicSlug)

  usePageSeo(
    topic
      ? {
          title: topic.title,
          description: topic.description,
          path: `/recycling/${topic.slug}`,
          keywords: `${topic.h1}, recycling London, e-waste, SecureFix, environment`,
          image: '/images/recycling-hero.png',
          jsonLd: [
            localBusinessJsonLd(),
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://securefix.uk/' },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Recycling',
                  item: 'https://securefix.uk/recycling',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: topic.h1,
                  item: `https://securefix.uk/recycling/${topic.slug}`,
                },
              ],
            },
          ],
        }
      : {
          title: 'Recycling | SecureFix',
          description: 'SecureFix recycling',
          path: '/recycling',
        },
  )

  if (!topic) return <NotFound />

  const related = recyclingTopicList.filter((item) => item.slug !== topic.slug).slice(0, 4)

  return (
    <div className="recycle-page site-page">
      <section className="recycle-hero recycle-hero-photo" aria-label={topic.h1}>
        <div className="recycle-hero-media" aria-hidden="true">
          <img src="/images/recycling-hero.png" alt="" className="recycle-hero-img" />
          <div className="recycle-hero-blur" />
          <div className="recycle-hero-shade" />
        </div>
        <div className="container recycle-hero-inner recycle-hero-inner-photo">
          <aside className="recycle-hero-widget" aria-label="Recycling symbol">
            <RecycleHeroArt />
          </aside>
          <div className="recycle-hero-copy">
            <p className="recycle-eyebrow">
              <Link to={RECYCLING_ROUTE} className="recycle-hero-back">
                ← Device Recycling
              </Link>
              {' · '}
              Secure · Compliant · Sustainable
            </p>
            <h1>
              {topic.h1} {topic.accent ? <span className="accent">{topic.accent}</span> : null}
            </h1>
            <p>{topic.lead}</p>
            <div className="recycle-hero-actions">
              <a href="#quote" className="btn btn-primary btn-shiny">
                Request a Quote
              </a>
              <a href="#process" className="btn btn-secondary recycle-hero-btn-outline">
                Our Recycling Process
              </a>
            </div>
            <div className="recycle-trust-badges">
              {recyclingContent.trustBadges.map((badge) => (
                <div key={badge.label} className="recycle-trust-badge">
                  <span>{badge.icon}</span>
                  <small>{badge.label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="recycle-main">
        <div className="container">
          <section className="recycle-section">
            <h2>
              Why this recycle job is good for the <span className="accent">environment</span>
            </h2>
            {topic.environment.map((para) => (
              <p key={para.slice(0, 48)} className="recycle-lead">
                {para}
              </p>
            ))}
            <div className="recycle-reasons recycle-topic-benefits">
              {topic.benefits.map((benefit) => (
                <article key={benefit.title} className="recycle-reason">
                  <span>{benefit.icon}</span>
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="process" className="recycle-section">
            <h2>
              Our Recycling <span className="accent">Process</span>
            </h2>
            <p className="recycle-lead">
              Every {topic.h1.toLowerCase()} request follows the same SecureFix recycling process as
              our main recycling service.
            </p>
            <div className="recycle-process">
              {recyclingContent.process.map((step) => (
                <article key={step.step} className="recycle-process-step">
                  <span className="recycle-process-icon">{step.icon}</span>
                  <span className="recycle-process-num">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="recycle-section">
            <h2>
              What we <span className="accent">cover</span>
            </h2>
            <ul className="recycle-topic-bullets">
              {topic.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="recycle-section recycle-split">
            <div>
              <h2>
                Ready to recycle with <span className="accent">SecureFix</span>
              </h2>
              <p className="recycle-lead">
                Tell us what you need to recycle. We will confirm collection or drop-off options and
                how we protect your data.
              </p>
              <p>
                Prefer to talk it through? Call{' '}
                <a href={site.phoneHref}>{site.phone}</a> or email{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
            </div>

            <div id="quote" className="recycle-quote">
              <h2>
                Request a <span className="accent">Quote</span>
              </h2>
              <RecyclingQuoteForm
                defaultEquipment={topic.equipmentDefault}
                topicLabel={topic.h1}
              />
            </div>
          </section>

          {related.length > 0 && (
            <section className="recycle-section">
              <h2>
                Related recycling <span className="accent">topics</span>
              </h2>
              <div className="recycle-categories">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/recycling/${item.slug}`}
                    className="recycle-category-card recycle-category-card-link"
                  >
                    <h3>{item.h1}</h3>
                    <p>{item.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="recycle-cta">
            <div>
              <span className="recycle-cta-icon">♻️</span>
              <h2>Recycling with SecureFix is good for the environment</h2>
              <p>
                Secure data handling first, then responsible recovery — so your devices help the
                planet instead of filling landfill.
              </p>
            </div>
            <div className="recycle-cta-actions">
              <a href="#quote" className="btn btn-primary btn-shiny">
                Request a Quote
              </a>
              <Link to={RECYCLING_ROUTE} className="btn btn-secondary">
                Back to Recycling
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
