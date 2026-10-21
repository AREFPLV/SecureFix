import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site, BOOKING_ROUTE } from '@/data/content'
import { aboutContent, faqItems } from '@/data/about'
import { usePageSeo } from '@/hooks/usePageSeo'
import { aboutSeo } from '@/data/seo'
import './About.css'

export default function About() {
  usePageSeo(aboutSeo)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  function toggleFaq(index: number) {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="about-page site-page">
      <div className="about-hero site-hero-bg">
        <div className="container">
          <h1>About <span className="accent">SecureFix</span></h1>
          <p>Your trusted device repair specialists in London</p>
        </div>
      </div>

      <main className="about-main">
        <div className="container">
          <section className="about-section">
            <h2>{aboutContent.whoWeAre.title}</h2>
            {aboutContent.whoWeAre.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="about-text">
                {p}
              </p>
            ))}
            <div className="about-stats-row">
              <div className="about-stat">
                <strong>2 Year</strong>
                <span>Warranty</span>
              </div>
              <div className="about-stat">
                <strong>Same Day</strong>
                <span>Service</span>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>{aboutContent.whatWeDo.title}</h2>
            <div className="about-services-grid">
              {aboutContent.whatWeDo.items.map((item) => (
                <article key={item.title} className="about-service-card">
                  <span className="about-service-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="faq" className="about-section about-faq-section">
            <h2>
              Frequently Asked <span className="accent">Questions</span>
            </h2>
            <p className="about-faq-intro">
              Got questions about repairs? Here are the answers to the most common ones.
            </p>
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <div
                  key={item.question}
                  className={`faq-item ${openFaq === index ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{item.question}</span>
                    <span className="faq-chevron">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  {openFaq === index && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="about-cta">
            <h2>Ready to get your device fixed?</h2>
            <p>Book online or call us today. Same-day service available.</p>
            <div className="about-cta-actions">
              <Link to={BOOKING_ROUTE} className="btn btn-primary btn-shiny">
                Book Repair Now
              </Link>
              <a href={`${site.phoneHref}`} className="btn btn-secondary btn-shiny">
                Call {site.phone}
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
