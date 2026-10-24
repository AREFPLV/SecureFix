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

/** Futuristic HUD motif — no photos; pure SVG/CSS motion per service. */
function FuturisticCore({ variant }: { variant: BusinessHeroVariant }) {
  return (
    <svg viewBox="0 0 120 120" className="biz-hero-svg" role="presentation">
      <defs>
        <linearGradient id="bizHeroAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbaf00" />
          <stop offset="100%" stopColor="#e09d00" />
        </linearGradient>
        <radialGradient id="bizHeroCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbaf00" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#fbaf00" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fbaf00" stopOpacity="0" />
        </radialGradient>
        <clipPath id="bizHeroClip">
          <circle cx="60" cy="60" r="38" />
        </clipPath>
      </defs>

      {/* Perspective grid floor */}
      <g className="biz-hero-grid" clipPath="url(#bizHeroClip)">
        <path
          className="biz-hero-grid-line"
          d="M10 78h100M18 86h84M28 94h64M40 102h40 M60 70v40 M40 70l-18 40 M80 70l18 40 M50 70l-8 40 M70 70l8 40"
        />
      </g>

      {/* Orbit rings */}
      <circle className="biz-hero-orbit-ring biz-hero-orbit-a" cx="60" cy="60" r="34" />
      <circle className="biz-hero-orbit-ring biz-hero-orbit-b" cx="60" cy="60" r="26" />
      <ellipse className="biz-hero-orbit-ring biz-hero-orbit-tilt" cx="60" cy="60" rx="40" ry="16" />

      {/* Energy core */}
      <circle className="biz-hero-core-glow" cx="60" cy="60" r="18" fill="url(#bizHeroCore)" />
      <circle className="biz-hero-core" cx="60" cy="60" r="8" />
      <circle className="biz-hero-core-ring" cx="60" cy="60" r="12" />

      {/* Scanning beam */}
      <g className="biz-hero-scan-arm">
        <line className="biz-hero-beam" x1="60" y1="60" x2="60" y2="22" />
        <circle className="biz-hero-node" cx="60" cy="22" r="2.5" />
      </g>

      {/* Orbiting data nodes */}
      <g className="biz-hero-satellites">
        <circle className="biz-hero-node biz-hero-sat" cx="94" cy="60" r="3.5" />
        <circle className="biz-hero-node biz-hero-sat biz-hero-sat-2" cx="60" cy="26" r="2.8" />
        <circle className="biz-hero-node biz-hero-sat biz-hero-sat-3" cx="28" cy="72" r="3" />
      </g>

      {/* Variant-specific glyph over the core */}
      <g className="biz-hero-glyph">{glyphFor(variant)}</g>

      {/* Data packets */}
      <g className="biz-hero-packets">
        <rect className="biz-hero-packet biz-hero-packet-a" x="18" y="40" width="10" height="3" rx="1" />
        <rect className="biz-hero-packet biz-hero-packet-b" x="92" y="48" width="8" height="3" rx="1" />
        <rect className="biz-hero-packet biz-hero-packet-c" x="74" y="88" width="12" height="3" rx="1" />
      </g>
    </svg>
  )
}

function glyphFor(variant: BusinessHeroVariant) {
  switch (variant) {
    case 'procurement':
      return (
        <>
          <path className="biz-hero-glyph-stroke" d="M48 52h24v16H48z" />
          <path className="biz-hero-glyph-stroke" d="M52 56h16M52 60h10" />
        </>
      )
    case 'deployment':
      return (
        <path
          className="biz-hero-glyph-stroke"
          d="M60 48l12 8v12l-12 8-12-8V56l12-8z"
        />
      )
    case 'os-setup':
      return (
        <>
          <circle className="biz-hero-glyph-stroke" cx="60" cy="60" r="7" />
          <path className="biz-hero-glyph-stroke" d="M60 50v4M60 66v4M50 60h4M66 60h4" />
        </>
      )
    case 'security':
      return (
        <path
          className="biz-hero-glyph-stroke"
          d="M60 50l10 4v8c0 6-4 10-10 12-6-2-10-6-10-12v-8l10-4z"
        />
      )
    case 'support':
      return (
        <path
          className="biz-hero-glyph-stroke"
          d="M52 56a8 8 0 0 1 16 0v6a4 4 0 0 1-4 4h-2v6h-4v-6h-2a4 4 0 0 1-4-4v-6z"
        />
      )
    case 'lifecycle-management':
      return (
        <path
          className="biz-hero-glyph-stroke"
          d="M52 54a10 10 0 1 1-2 12M68 66a10 10 0 1 1 2-12"
        />
      )
    case 'industry':
      return (
        <path className="biz-hero-glyph-stroke" d="M50 70V56h6v14H50zm8 0V50h6v20H58zm8 0V58h6v12H66z" />
      )
    case 'business':
    default:
      return (
        <>
          <path className="biz-hero-glyph-stroke" d="M48 58h24v10H48z" />
          <path className="biz-hero-glyph-stroke" d="M54 54h12v4H54z" />
          <circle className="biz-hero-node" cx="60" cy="63" r="1.6" />
        </>
      )
  }
}

type Props = {
  variant?: BusinessHeroVariant
}

/** Animated Business IT hero — futuristic HUD motion (no photo). */
export default function BusinessHeroArt({ variant = 'business' }: Props) {
  const meta = VARIANT_META[variant] ?? VARIANT_META.business

  return (
    <div className={`biz-hero-art biz-hero-art-${variant}`} aria-hidden="true">
      <div className="biz-hero-art-stage">
        <div className="biz-hero-art-glow" />
        <div className="biz-hero-art-ring biz-hero-art-ring-outer" />
        <div className="biz-hero-art-ring biz-hero-art-ring-inner" />
        <div className="biz-hero-art-ring biz-hero-art-ring-ticks" />
        <div className="biz-hero-art-radar" />
        <div className="biz-hero-art-spark biz-hero-art-spark-1" />
        <div className="biz-hero-art-spark biz-hero-art-spark-2" />
        <div className="biz-hero-art-spark biz-hero-art-spark-3" />

        <div className="biz-hero-art-mark">
          <FuturisticCore variant={variant} />
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
