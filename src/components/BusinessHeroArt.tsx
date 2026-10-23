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

function SceneIcon({ variant }: { variant: BusinessHeroVariant }) {
  switch (variant) {
    case 'procurement':
      return (
        <g className="biz-hero-scene">
          <rect className="biz-hero-laptop" x="28" y="46" width="64" height="42" rx="4" />
          <rect className="biz-hero-screen" x="34" y="52" width="52" height="28" rx="2" />
          <path className="biz-hero-stroke" d="M24 92h72" />
          <g className="biz-hero-float biz-hero-float-a">
            <rect x="78" y="30" width="22" height="16" rx="2" className="biz-hero-card" />
          </g>
          <g className="biz-hero-float biz-hero-float-b">
            <rect x="20" y="34" width="18" height="14" rx="2" className="biz-hero-card" />
          </g>
          <circle className="biz-hero-node" cx="60" cy="66" r="3" />
        </g>
      )
    case 'deployment':
      return (
        <g className="biz-hero-scene">
          <rect className="biz-hero-laptop" x="38" y="40" width="44" height="30" rx="3" />
          <rect className="biz-hero-screen" x="43" y="45" width="34" height="18" rx="1.5" />
          <g className="biz-hero-orbit">
            <circle className="biz-hero-node" cx="28" cy="38" r="4" />
            <circle className="biz-hero-node" cx="96" cy="48" r="4" />
            <circle className="biz-hero-node" cx="84" cy="86" r="4" />
            <circle className="biz-hero-node" cx="36" cy="84" r="4" />
          </g>
          <path
            className="biz-hero-stroke biz-hero-dash"
            d="M60 55 L28 38 M60 55 L96 48 M60 55 L84 86 M60 55 L36 84"
          />
        </g>
      )
    case 'os-setup':
      return (
        <g className="biz-hero-scene">
          <rect className="biz-hero-laptop" x="30" y="38" width="60" height="44" rx="4" />
          <rect className="biz-hero-screen" x="36" y="44" width="48" height="28" rx="2" />
          <g className="biz-hero-gear">
            <circle cx="60" cy="58" r="10" className="biz-hero-stroke-fill" />
            <circle cx="60" cy="58" r="4" className="biz-hero-node" />
          </g>
          <rect className="biz-hero-progress" x="40" y="78" width="40" height="4" rx="2" />
          <rect className="biz-hero-progress-bar" x="40" y="78" width="24" height="4" rx="2" />
        </g>
      )
    case 'security':
      return (
        <g className="biz-hero-scene">
          <path
            className="biz-hero-shield"
            d="M60 28l28 10v22c0 16-12 28-28 34-16-6-28-18-28-34V38l28-10z"
          />
          <path className="biz-hero-check" d="M46 62l10 10 18-20" />
          <line className="biz-hero-scan" x1="36" y1="52" x2="84" y2="52" />
        </g>
      )
    case 'support':
      return (
        <g className="biz-hero-scene">
          <path
            className="biz-hero-stroke"
            d="M38 54a22 22 0 0 1 44 0v10a8 8 0 0 1-8 8h-4v12h-8V72h-8a8 8 0 0 1-8-8V54z"
          />
          <circle className="biz-hero-node biz-hero-pulse" cx="42" cy="58" r="3" />
          <circle className="biz-hero-node biz-hero-pulse biz-hero-pulse-delay" cx="78" cy="58" r="3" />
          <g className="biz-hero-float biz-hero-float-a">
            <rect className="biz-hero-card" x="86" y="34" width="20" height="14" rx="7" />
          </g>
        </g>
      )
    case 'lifecycle-management':
      return (
        <g className="biz-hero-scene">
          <circle className="biz-hero-stroke biz-hero-loop" cx="60" cy="60" r="28" />
          <g className="biz-hero-orbit">
            <circle className="biz-hero-node" cx="60" cy="32" r="5" />
            <circle className="biz-hero-node" cx="88" cy="60" r="5" />
            <circle className="biz-hero-node" cx="60" cy="88" r="5" />
            <circle className="biz-hero-node" cx="32" cy="60" r="5" />
          </g>
          <rect className="biz-hero-laptop" x="48" y="50" width="24" height="16" rx="2" />
        </g>
      )
    case 'industry':
      return (
        <g className="biz-hero-scene">
          <path
            className="biz-hero-stroke"
            d="M34 88V44h18v44H34zm22 0V28h20v60H56zm26 0V52h18v36H82z"
          />
          <g className="biz-hero-float biz-hero-float-b">
            <rect className="biz-hero-card" x="40" y="34" width="14" height="10" rx="1.5" />
          </g>
          <circle className="biz-hero-node biz-hero-pulse" cx="66" cy="40" r="3" />
          <circle className="biz-hero-node biz-hero-pulse biz-hero-pulse-delay" cx="91" cy="46" r="3" />
        </g>
      )
    case 'business':
    default:
      return (
        <g className="biz-hero-scene">
          <rect className="biz-hero-laptop" x="32" y="42" width="56" height="38" rx="4" />
          <rect className="biz-hero-screen" x="38" y="48" width="44" height="24" rx="2" />
          <path className="biz-hero-stroke" d="M28 88h64" />
          <g className="biz-hero-orbit">
            <circle className="biz-hero-node" cx="26" cy="40" r="4" />
            <circle className="biz-hero-node" cx="96" cy="54" r="4" />
            <circle className="biz-hero-node" cx="78" cy="28" r="3.5" />
          </g>
          <path className="biz-hero-stroke biz-hero-dash" d="M38 56 L26 40 M82 56 L96 54 M70 48 L78 28" />
          <circle className="biz-hero-node biz-hero-pulse" cx="60" cy="60" r="3" />
        </g>
      )
  }
}

type Props = {
  variant?: BusinessHeroVariant
}

/** Animated Business IT hero mark — rings, glow, and a service-related SVG scene. */
export default function BusinessHeroArt({ variant = 'business' }: Props) {
  const meta = VARIANT_META[variant] ?? VARIANT_META.business

  return (
    <div className={`biz-hero-art biz-hero-art-${variant}`} aria-hidden="true">
      <div className="biz-hero-art-stage">
        <div className="biz-hero-art-glow" />
        <div className="biz-hero-art-ring biz-hero-art-ring-outer" />
        <div className="biz-hero-art-ring biz-hero-art-ring-inner" />
        <div className="biz-hero-art-ring biz-hero-art-ring-ticks" />

        <div className="biz-hero-art-mark">
          <svg viewBox="0 0 120 120" className="biz-hero-svg" role="presentation">
            <defs>
              <linearGradient id="bizHeroAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbaf00" />
                <stop offset="100%" stopColor="#e09d00" />
              </linearGradient>
            </defs>
            <SceneIcon variant={variant} />
          </svg>
          <span className="biz-hero-badge">{meta.label}</span>
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
