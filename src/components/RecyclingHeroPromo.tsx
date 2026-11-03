import RecycleHeroArt from '@/components/RecycleHeroArt'
import './RecyclingHeroPromo.css'
import './HeroPromo.css'

type Props = {
  label?: string
}

/** Home-style hero media box: recycle logo with a circle around it only. */
export default function RecyclingHeroPromo({ label = 'SecureFix recycling' }: Props) {
  return (
    <div className="hero-promo recycling-hero-promo" aria-label={label}>
      <div className="hero-promo-media recycling-hero-promo-media">
        <div className="recycling-hero-promo-icon">
          <RecycleHeroArt />
        </div>
      </div>

      <div className="hero-promo-overlay recycling-hero-promo-overlay" />
      <div className="hero-promo-glow" />

      <div className="hero-promo-badge">
        <img src="/logo.png" alt="" className="hero-promo-logo" />
      </div>
    </div>
  )
}
