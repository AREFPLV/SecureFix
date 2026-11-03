import BusinessHeroArt, {
  businessHeroVariantFromSlug,
  type BusinessHeroVariant,
} from '@/components/BusinessHeroArt'
import PromoBackdropMotif from '@/components/PromoBackdropMotif'
import './BusinessHeroPromo.css'
import './HeroPromo.css'

export type BusinessPromoSlide = {
  tag: string
  title: string
  subtitle: string
}

type Props = {
  variant?: BusinessHeroVariant
  /** Industry solution slug — draws hospital, law, school, etc. in the box background. */
  industrySlug?: string
  /** Service slug used when variant is inferred from URL. */
  serviceSlug?: string
  slides?: BusinessPromoSlide[]
  label?: string
}

const DEFAULT_SLIDES: BusinessPromoSlide[] = [
  {
    tag: 'Business IT',
    title: 'Devices Done Right',
    subtitle: 'Source · configure · deploy · support',
  },
  {
    tag: 'London Workshop',
    title: 'One Accountable Partner',
    subtitle: 'Hardware lifecycle without the juggling',
  },
  {
    tag: 'Desk Ready',
    title: 'Built For Day One',
    subtitle: 'Imaged, labelled and ready for staff',
  },
]

/** Home-style hero media box: SecureFix circle + industry/service line-draw background. */
export default function BusinessHeroPromo({
  variant,
  industrySlug,
  serviceSlug,
  slides = DEFAULT_SLIDES,
  label = 'SecureFix Business IT',
}: Props) {
  const resolvedVariant =
    variant ??
    (industrySlug ? 'industry' : businessHeroVariantFromSlug(serviceSlug))
  const uid = `bizPromo-${industrySlug || resolvedVariant}`

  return (
    <div className="hero-promo business-hero-promo" aria-label={label}>
      <div className="hero-promo-media business-hero-promo-media">
        <div className="business-hero-promo-lines" aria-hidden="true">
          <PromoBackdropMotif
            variant={resolvedVariant}
            industrySlug={industrySlug}
            uid={uid}
          />
        </div>
        <div className="business-hero-promo-circle">
          <BusinessHeroArt variant={resolvedVariant} />
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
