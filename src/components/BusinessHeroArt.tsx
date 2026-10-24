import './BusinessHeroArt.css'

export type BusinessHeroVariant =
  | 'business'
  | 'procurement'
  | 'deployment'
  | 'os-setup'
  | 'security'
  | 'support'
  | 'lifecycle-management'
  | 'industry'

const VARIANT_META: Record<
  BusinessHeroVariant,
  { caption: string; label: string }
> = {
  business: { caption: 'Source · Deploy · Support', label: 'Business IT' },
  procurement: { caption: 'Spec · Source · Supply', label: 'Procurement' },
  deployment: { caption: 'Image · Configure · Deliver', label: 'Deployment' },
  'os-setup': { caption: 'Install · Secure · Ready', label: 'OS Setup' },
  security: { caption: 'Protect · Monitor · Respond', label: 'Security' },
  support: { caption: 'Diagnose · Fix · Maintain', label: 'Support' },
  'lifecycle-management': { caption: 'Buy · Use · Renew', label: 'Lifecycle' },
  industry: { caption: 'Workplace · Devices · Support', label: 'Industry IT' },
}

type Props = {
  variant?: BusinessHeroVariant
}

/** Simple rotating ring with SecureFix at the centre. */
export default function BusinessHeroArt({ variant = 'business' }: Props) {
  const meta = VARIANT_META[variant] ?? VARIANT_META.business

  return (
    <div className={`biz-hero-art biz-hero-art-${variant}`} aria-hidden="true">
      <div className="biz-hero-art-stage">
        <div className="biz-hero-art-glow" />
        <div className="biz-hero-art-ring biz-hero-art-ring-outer" />
        <div className="biz-hero-art-ring biz-hero-art-ring-inner" />

        <div className="biz-hero-art-core">
          <span className="biz-hero-art-brand">SecureFix</span>
          <span className="biz-hero-art-label">{meta.label}</span>
        </div>
      </div>

      <p className="biz-hero-art-caption">{meta.caption}</p>
    </div>
  )
}

export function businessHeroVariantFromSlug(slug?: string | null): BusinessHeroVariant {
  switch (slug) {
    case 'procurement':
    case 'deployment':
    case 'os-setup':
    case 'security':
    case 'support':
    case 'lifecycle-management':
      return slug
    default:
      return 'business'
  }
}
