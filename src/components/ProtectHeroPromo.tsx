import './ProtectHeroPromo.css'
import './HeroPromo.css'

type Props = {
  label?: string
}

/** Home-style hero media box: shield mark inside a circle. */
export default function ProtectHeroPromo({ label = 'SecureFix Protect' }: Props) {
  return (
    <div className="hero-promo protect-hero-promo" aria-label={label}>
      <div className="hero-promo-media protect-hero-promo-media">
        <div className="protect-hero-promo-icon" aria-hidden="true">
          <div className="protect-hero-promo-orb">
            <span className="protect-hero-promo-ring protect-hero-promo-ring-outer" />
            <span className="protect-hero-promo-ring protect-hero-promo-ring-inner" />
            <svg className="protect-hero-promo-mark" viewBox="0 0 64 64" role="img">
              <path
                d="M32 6 12 14v16c0 14.5 8.8 24.3 20 28 11.2-3.7 20-13.5 20-28V14L32 6Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
              <path
                d="m22.5 32 6.2 6.2L42 24.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="hero-promo-overlay protect-hero-promo-overlay" />
      <div className="hero-promo-glow" />

      <div className="hero-promo-badge">
        <img src="/logo.png" alt="" className="hero-promo-logo" />
      </div>
    </div>
  )
}
