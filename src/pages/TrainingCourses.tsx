import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/data/content'
import {
  trainingContent,
  trainingCourses,
  trainingLevelPath,
} from '@/data/training'
import TrainingHeroPromo from '@/components/TrainingHeroPromo'
import { usePageSeo } from '@/hooks/usePageSeo'
import { trainingSeo } from '@/data/seo'
import './About.css'
import './TrainingCourses.css'
import '@/components/Hero.css'

export default function TrainingCourses() {
  usePageSeo(trainingSeo)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  function toggleFaq(index: number) {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="about-page training-page site-page">
      <section className="hero page-hero training-page-hero">
        <div className="hero-bg" />
        <div className="container hero-layout training-hero-layout">
          <div className="hero-content training-hero-copy">
            <p className="hero-eyebrow">SecureFix Academy · London EC1V</p>
            <h1>
              <span className="hero-line">{trainingContent.heroTitle}</span>
              <span className="hero-line accent">{trainingContent.heroAccent}</span>
            </h1>
            <p className="hero-subtitle">{trainingContent.heroSubtitle}</p>
            <div className="hero-actions training-hero-actions">
              <a href="#courses" className="btn btn-primary btn-shiny">
                View courses
              </a>
              <a href={`${site.phoneHref}`} className="btn btn-secondary btn-shiny">
                Call {site.phone}
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>3 Courses</strong>
                <span>Mobile · PC · Apple</span>
              </div>
              <div className="hero-stat">
                <strong>3 Levels</strong>
                <span>Junior to Advance</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <TrainingHeroPromo />
          </div>
        </div>
      </section>

      <main className="about-main">
        <div className="container">
          <section className="about-section">
            <h2>{trainingContent.intro.title}</h2>
            {trainingContent.intro.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="about-text">
                {p}
              </p>
            ))}
          </section>

          <section id="courses" className="about-section">
            <h2>
              Our <span className="accent">Courses</span>
            </h2>
            <div className="training-course-grid">
              {trainingCourses.map((course) => (
                <article key={course.slug} className="training-course-card">
                  <h3>{course.title}</h3>
                  <p className="training-course-meta">
                    <strong>{course.sessions} sessions</strong> per level · {course.mode}
                  </p>
                  <p className="training-course-desc">{course.description}</p>
                  <div className="training-level-tags" aria-label={`${course.title} levels`}>
                    {course.levels.map((item) => (
                      <Link
                        key={item.id}
                        to={trainingLevelPath(course.slug, item.id)}
                        className="training-level-tag"
                      >
                        <span className="training-level-tag-rank">Level {item.rank}</span>
                        <span className="training-level-tag-name">{item.label}</span>
                        <span className="training-level-tag-price">{item.priceText}</span>
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h2>{trainingContent.whoFor.title}</h2>
            <div className="about-services-grid">
              {trainingContent.whoFor.items.map((item) => (
                <article key={item.title} className="about-service-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="faq" className="about-section about-faq-section">
            <h2>
              Training <span className="accent">FAQs</span>
            </h2>
            <div className="faq-list">
              {trainingContent.faqs.map((item, index) => (
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
            <h2>Ready to start training?</h2>
            <p>Enquire about dates and places — we will get back to you quickly.</p>
            <div className="about-cta-actions">
              <a href={`${site.phoneHref}`} className="btn btn-primary btn-shiny">
                Call {site.phone}
              </a>
              <a
                href={site.whatsapp}
                className="btn btn-secondary btn-shiny"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {site.whatsappPhone}
              </a>
              <a href={`mailto:${site.email}`} className="btn btn-secondary btn-shiny">
                Email {site.email}
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
