import './AboutHeroPromo.css'
import './HeroPromo.css'

type Props = {
  label?: string
}

/** Home-style hero media box: question mark inside a circle. */
export default function AboutHeroPromo({ label = 'About SecureFix' }: Props) {
  return (
    <div className="hero-promo about-hero-promo" aria-label={label}>
      <div className="hero-promo-media about-hero-promo-media">
        <div className="about-hero-promo-icon" aria-hidden="true">
          <div className="about-hero-promo-orb">
            <span className="about-hero-promo-ring about-hero-promo-ring-outer" />
            <span className="about-hero-promo-ring about-hero-promo-ring-inner" />
            <span className="about-hero-promo-mark">?</span>
          </div>
        </div>
      </div>

      <div className="hero-promo-overlay about-hero-promo-overlay" />
      <div className="hero-promo-glow" />

      <div className="hero-promo-badge">
        <img src="/logo.png" alt="" className="hero-promo-logo" />
      </div>
    </div>
  )
}
