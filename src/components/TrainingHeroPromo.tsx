import './TrainingHeroPromo.css'

const certificates = [
  {
    src: '/images/training/certificate-1.webp',
    fallback: '/images/training/certificate-1.jpg',
    tag: 'Certificate',
    title: 'SecureFix Academy',
    subtitle: 'Certificate of Achievement',
  },
  {
    src: '/images/training/certificate-2.webp',
    fallback: '/images/training/certificate-2.jpg',
    tag: 'Professional Training',
    title: 'Foundation Programme',
    subtitle: 'Mobile Phone & Tablet Repair',
  },
  {
    src: '/images/training/certificate-3.webp',
    fallback: '/images/training/certificate-3.jpg',
    tag: 'Accredited Skills',
    title: 'Graduate Ready',
    subtitle: 'Hands-on workshop certification',
  },
]

/** Home-hero style media widget cycling SecureFix Academy certificates. */
export default function TrainingHeroPromo() {
  return (
    <div className="training-promo hero-promo" aria-label="SecureFix Academy certificates">
      <div className="hero-promo-media training-promo-media">
        {certificates.map((cert, i) => (
          <picture
            key={cert.src}
            className="training-promo-frame"
            style={{ animationDelay: `${i * 5}s` }}
          >
            <source srcSet={cert.src} type="image/webp" />
            <img
              src={cert.fallback}
              alt=""
              className="hero-promo-img training-promo-img"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </picture>
        ))}
      </div>

      <div className="hero-promo-overlay" />
      <div className="hero-promo-glow" />

      <div className="hero-promo-slides">
        {certificates.map((slide, i) => (
          <div
            key={slide.title}
            className="hero-promo-slide"
            style={{ animationDelay: `${i * 5}s` }}
          >
            <span className="hero-promo-tag">{slide.tag}</span>
            <strong>{slide.title}</strong>
            <span>{slide.subtitle}</span>
          </div>
        ))}
      </div>

      <div className="hero-promo-badge">
        <img src="/logo.png" alt="" className="hero-promo-logo" />
      </div>
    </div>
  )
}
