import './HeroPromo.css'

const slides = [
  {
    tag: 'Same Day Service',
    title: 'Repairs Done Today',
    subtitle: 'Most devices fixed within 45 minutes',
  },
  {
    tag: 'Premium Parts',
    title: 'Quality You Can Trust',
    subtitle: 'Premium parts fitted by experts',
  },
  {
    tag: 'All Devices',
    title: 'Phones · Laptops · Gaming',
    subtitle: 'Tablets · Watches · Consoles & more',
  },
]

export default function HeroPromo() {
  return (
    <div className="hero-promo" aria-label="SecureFix repair services">
      <div className="hero-promo-media">
        <img
          src="/images/hero-devices.png"
          alt="SecureFix repairs phones, laptops and gaming devices"
          className="hero-promo-img"
        />
      </div>

      <div className="hero-promo-overlay" />

      <div className="hero-promo-glow" />

      <div className="hero-promo-slides">
        {slides.map((slide, i) => (
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
