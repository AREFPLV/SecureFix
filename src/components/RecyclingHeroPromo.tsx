import RecycleHeroArt from '@/components/RecycleHeroArt'
import './RecyclingHeroPromo.css'
import './HeroPromo.css'

type Slide = {
  tag: string
  title: string
  subtitle: string
}

const DEFAULT_SLIDES: Slide[] = [
  {
    tag: 'Secure Wipe',
    title: 'Data Destroyed Properly',
    subtitle: 'Certified erasure before recycling',
  },
  {
    tag: 'WEEE Compliant',
    title: 'Responsible E-Waste',
    subtitle: 'Phones · tablets · laptops · IT assets',
  },
  {
    tag: 'London Collection',
    title: 'Drop Off Or Collect',
    subtitle: 'Simple recycling for homes and business',
  },
]

type Props = {
  slides?: Slide[]
  label?: string
}

/** Home-style hero media box with the SecureFix recycling icon. */
export default function RecyclingHeroPromo({
  slides = DEFAULT_SLIDES,
  label = 'SecureFix recycling',
}: Props) {
  return (
    <div className="hero-promo recycling-hero-promo" aria-label={label}>
      <div className="hero-promo-media recycling-hero-promo-media">
        <div className="recycling-hero-promo-lines" aria-hidden="true">
          <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice">
            <g className="promo-line-draw recycling-promo-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M240 90 L310 210 H170 Z" />
              <path d="M310 210 L380 330 H240 Z" />
              <path d="M170 210 L100 330 H240 Z" />
              <path d="M255 125 L290 185" />
              <path d="M330 245 L355 290" />
              <path d="M150 245 L125 290" />
              <circle cx="240" cy="250" r="118" />
              <circle cx="240" cy="250" r="150" strokeDasharray="10 14" />
            </g>
          </svg>
        </div>
        <div className="recycling-hero-promo-icon">
          <RecycleHeroArt />
        </div>
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
