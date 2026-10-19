import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/content'
import { recyclingContent } from '@/data/recycling'
import { recyclingTopics } from '@/data/seoCatalog'
import RecyclingQuoteForm from '@/components/RecyclingQuoteForm'
import RecycleHeroArt from '@/components/RecycleHeroArt'
import { usePageSeo } from '@/hooks/usePageSeo'
import { recyclingSeo } from '@/data/seo'
import './Recycling.css'

export default function Recycling() {
  usePageSeo(recyclingSeo)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  function toggleFaq(index: number) {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="recycle-page site-page">
      <section className="recycle-hero recycle-hero-photo" aria-label="SecureFix recycling">
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
            <p className="recycle-eyebrow">Secure · Compliant · Sustainable</p>
            <h1>
              Professional {recyclingContent.hero.title} &amp;{' '}
              <span className="accent">{recyclingContent.hero.accent}</span>
            </h1>
            <p>{recyclingContent.hero.subtitle}</p>
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
              {recyclingContent.intro.title}{' '}
              <span className="accent">{recyclingContent.intro.accent}</span>
            </h2>
            <p className="recycle-lead">{recyclingContent.intro.text}</p>
            <div className="recycle-stats">
              {recyclingContent.stats.map((stat) => (
                <div key={stat.label} className="recycle-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="process" className="recycle-section">
            <h2>
              Our Recycling <span className="accent">Process</span>
            </h2>
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
              Recycling <span className="accent">Topics</span>
            </h2>
            <div className="recycle-categories">
              {recyclingTopics.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/recycling/${topic.slug}`}
                  className="recycle-category-card recycle-category-card-link"
                >
                  <h3>{topic.h1}</h3>
                  <p>{topic.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="recycle-section">
            <h2>
              What We <span className="accent">Recycle</span>
            </h2>
            <div className="recycle-categories">
              {recyclingContent.categories.map((cat) => (
                <article key={cat.title} className="recycle-category-card">
                  <span className="recycle-category-icon">{cat.icon}</span>
                  <h3>{cat.title}</h3>
                  <ul>
                    {cat.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="recycle-section recycle-split">
            <div>
              <h2>
                Why Choose <span className="accent">SecureFix</span>
              </h2>
              <div className="recycle-reasons">
                {recyclingContent.reasons.map((reason) => (
                  <article key={reason.title} className="recycle-reason">
                    <span>{reason.icon}</span>
                    <div>
                      <h3>{reason.title}</h3>
                      <p>{reason.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div id="quote" className="recycle-quote">
              <h2>
                Request a <span className="accent">Quote</span>
              </h2>
              <RecyclingQuoteForm />
            </div>
          </section>

          <section className="recycle-section">
            <h2>
              Who We <span className="accent">Work With</span>
            </h2>
            <div className="recycle-sectors">
              {recyclingContent.sectors.map((sector) => (
                <div key={sector.label} className="recycle-sector">
                  <span>{sector.icon}</span>
                  <small>{sector.label}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="recycle-section">
            <h2>
              Frequently Asked <span className="accent">Questions</span>
            </h2>
            <div className="recycle-faq-list">
              {recyclingContent.faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className={`recycle-faq-item${openFaq === index ? ' open' : ''}`}
                >
                  <button
                    type="button"
                    className="recycle-faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaq === index}
                  >
                    {faq.question}
                    <span className="recycle-faq-chevron">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index && (
                    <div className="recycle-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="recycle-cta">
            <div>
              <span className="recycle-cta-icon">♻️</span>
              <h2>Ready to Recycle Your IT Equipment Securely?</h2>
              <p>Talk to SecureFix about collection, drop-off, or a business clear-out.</p>
            </div>
            <div className="recycle-cta-actions">
              <a href="#quote" className="btn btn-primary btn-shiny">
                Request a Quote
              </a>
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
