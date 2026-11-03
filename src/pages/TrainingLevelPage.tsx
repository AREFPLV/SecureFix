import { Link, useParams } from 'react-router-dom'
import { site, TRAINING_ROUTE } from '@/data/content'
import {
  getTrainingLevel,
  trainingLevelPath,
  type TrainingLevelId,
} from '@/data/training'
import NotFound from '@/pages/NotFound'
import { usePageSeo } from '@/hooks/usePageSeo'
import { localBusinessJsonLd } from '@/data/seo'
import './About.css'
import './TrainingCourses.css'

export default function TrainingLevelPage() {
  const { courseSlug, levelId } = useParams<{ courseSlug: string; levelId: string }>()
  const match = getTrainingLevel(courseSlug, levelId)

  usePageSeo(
    match
      ? {
          title: `${match.course.title} · ${match.level.label} | SecureFix Academy`,
          description: `${match.level.label} ${match.course.title} training in London — ${match.level.sessions} sessions from ${match.level.priceText}. ${match.level.summary}`,
          path: trainingLevelPath(match.course.slug, match.level.id),
          keywords: `${match.course.title}, ${match.level.label} repair course London, SecureFix Academy, ${match.level.outcomes.slice(0, 3).join(', ')}`,
          jsonLd: [
            localBusinessJsonLd(),
            {
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: `${match.course.title} — ${match.level.label}`,
              description: match.level.summary,
              provider: {
                '@type': 'Organization',
                name: 'SecureFix Academy',
              },
              offers: {
                '@type': 'Offer',
                price: match.level.price,
                priceCurrency: 'GBP',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://securefix.uk/' },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Training Courses',
                  item: `https://securefix.uk${TRAINING_ROUTE}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: `${match.course.title} · ${match.level.label}`,
                  item: `https://securefix.uk${trainingLevelPath(match.course.slug, match.level.id)}`,
                },
              ],
            },
          ],
        }
      : {
          title: 'Training Courses | SecureFix',
          description: 'SecureFix Academy training courses in London.',
          path: TRAINING_ROUTE,
        },
  )

  if (!match) return <NotFound />

  const { course, level } = match
  const otherLevels = course.levels.filter((item) => item.id !== level.id)

  return (
    <div className="about-page training-page training-level-page site-page">
      <div className="about-hero site-hero-bg training-level-hero">
        <div className="container">
          <p className="training-level-kicker">
            <Link to={TRAINING_ROUTE}>← Training Courses</Link>
            <span aria-hidden="true">·</span>
            <span>{course.title}</span>
          </p>
          <h1>
            {level.label}{' '}
            <span className="accent">{course.accent}</span>
          </h1>
          <p>{level.summary}</p>
          <div className="training-level-stats">
            <span className="training-level-stat">
              Level <strong>{level.rank}</strong> · {level.label}
            </span>
            <span className="training-level-stat">
              <strong>{level.sessions}</strong> sessions
            </span>
            <span className="training-level-stat">
              From <strong>{level.priceText}</strong>
            </span>
            <span className="training-level-stat">{course.mode}</span>
          </div>
        </div>
      </div>

      <main className="about-main">
        <div className="container">
          <section className="about-section">
            <h2>
              What you will <span className="accent">learn</span>
            </h2>
            <p className="about-text">{level.learnIntro}</p>
            <ul className="training-learn-list">
              {level.learnDetails.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="about-section">
            <h2>
              Skills covered on this <span className="accent">level</span>
            </h2>
            <div className="about-services-grid">
              {level.outcomes.map((outcome) => (
                <article key={outcome} className="about-service-card">
                  <h3>{outcome}</h3>
                  <p>
                    Taught hands-on during the {level.sessions}-session {level.label} programme for{' '}
                    {course.title.toLowerCase()}.
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h2>
              Who this level is <span className="accent">for</span>
            </h2>
            <p className="about-text">{level.whoFor}</p>
          </section>

          {otherLevels.length > 0 ? (
            <section className="about-section">
              <h2>
                Other levels on this <span className="accent">course</span>
              </h2>
              <div className="training-other-levels">
                {otherLevels.map((item) => (
                  <Link
                    key={item.id}
                    to={trainingLevelPath(course.slug, item.id as TrainingLevelId)}
                    className="training-level-tag"
                  >
                    <span className="training-level-tag-rank">Level {item.rank}</span>
                    <span className="training-level-tag-name">{item.label}</span>
                    <span className="training-level-tag-price">{item.priceText}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="about-cta">
            <h2>
              Enquire about {level.label} {course.accent}
            </h2>
            <p>
              Tell us you want {course.title} — {level.label} ({level.priceText}). We will confirm the
              next 5-session dates.
            </p>
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
