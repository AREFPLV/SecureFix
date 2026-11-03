import type { BusinessHeroVariant } from '@/components/BusinessHeroArt'

type Props = {
  variant?: BusinessHeroVariant
  industrySlug?: string
  uid: string
}

/** Compact line-draw motifs sized for the home-style hero promo box. */
export default function PromoBackdropMotif({ variant = 'business', industrySlug, uid }: Props) {
  const key = industrySlug || variant

  switch (key) {
    case 'care-homes':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M90 360 V220 H170 V160 H220 V130 H260 V160 H310 V220 H390 V360" />
            <path d="M210 145 H270 M240 120 V180" />
            <rect x="130" y="250" width="36" height="44" />
            <rect x="180" y="250" width="36" height="44" />
            <rect x="270" y="250" width="36" height="44" />
            <rect x="320" y="250" width="36" height="44" />
            <path d="M220 360 V300 H260 V360" />
            <path d="M40 360 H440" />
            <circle cx="400" cy="170" r="36" />
            <path d="M400 148 V192 M378 170 H422" />
          </g>
        </svg>
      )
    case 'law-firms-solicitors':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M240 90 V290" />
            <path d="M150 130 H330" />
            <path d="M170 130 Q120 200 100 260" />
            <path d="M310 130 Q360 200 380 260" />
            <circle cx="100" cy="275" r="28" />
            <circle cx="380" cy="275" r="28" />
            <path d="M200 290 H280 V360 H200 Z" />
            <path d="M70 360 H410" />
          </g>
        </svg>
      )
    case 'schools-education':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M100 360 V230 L240 140 L380 230 V360" />
            <path d="M160 360 V270 H210 V360" />
            <rect x="230" y="250" width="44" height="36" />
            <rect x="300" y="250" width="44" height="36" />
            <path d="M240 140 V100" />
            <path d="M240 100 H280 L268 112" />
            <path d="M50 360 H430" />
          </g>
        </svg>
      )
    case 'cafes-restaurants':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M110 360 V210 H370 V360" />
            <path d="M95 210 H385" />
            <path d="M110 210 L145 155 H335 L370 210" />
            <rect x="170" y="245" width="55" height="48" />
            <rect x="260" y="245" width="55" height="48" />
            <path d="M205 360 V310 H255 V360" />
            <circle cx="400" cy="240" r="30" />
            <path d="M400 210 C418 224, 418 250, 400 270" />
            <path d="M50 360 H430" />
          </g>
        </svg>
      )
    case 'construction-sites':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M80 360 V180 H150 V360" />
            <path d="M115 180 V120" />
            <path d="M115 120 H320" />
            <path d="M320 120 V230" />
            <path d="M300 230 H390" />
            <path d="M180 360 V260 H300 V360" />
            <path d="M360 360 L400 280 L440 360 Z" />
            <circle cx="115" cy="120" r="8" />
            <path d="M40 360 H440" />
          </g>
        </svg>
      )
    case 'hotels-hostels':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M110 360 V150 H370 V360" />
            <path d="M150 190 H200 M150 240 H200 M150 290 H200" />
            <path d="M230 190 H280 M230 240 H280 M230 290 H280" />
            <path d="M310 190 H350 M310 240 H350 M310 290 H350" />
            <path d="M210 360 V300 H270 V360" />
            <path d="M220 120 L240 90 L260 120 Z" />
            <path d="M40 360 H440" />
          </g>
        </svg>
      )
    case 'airports':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M40 300 H440" />
            <path d="M70 300 H150 M180 300 H260 M290 300 H370" strokeDasharray="8 12" />
            <path d="M180 270 L280 220 L360 210 L390 235 L330 255 L280 255 L220 295 Z" />
            <path d="M280 220 L250 150 L280 175" />
            <circle cx="400" cy="160" r="32" />
            <path d="M400 140 V180 M380 160 H420" />
          </g>
        </svg>
      )
    case 'offices':
    case 'businesses-corporate':
    case 'business':
    case 'industry':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M60 360 V240 H110 V360 M130 360 V180 H200 V360 M220 360 V210 H280 V360 M300 360 V150 H380 V360 M400 360 V230 H440 V360" />
            <path d="M40 360 H440" />
          </g>
        </svg>
      )
    case 'procurement':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <rect x="70" y="250" width="80" height="70" rx="6" />
            <rect x="170" y="210" width="95" height="90" rx="6" />
            <rect x="285" y="235" width="75" height="65" rx="6" />
            <rect x="360" y="195" width="70" height="100" rx="6" />
            <path d="M50 300 C140 230, 220 340, 310 270 S420 240, 450 290" />
            <circle cx="140" cy="270" r="4" />
            <circle cx="250" cy="300" r="4" />
            <circle cx="370" cy="260" r="4" />
          </g>
        </svg>
      )
    case 'deployment':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M60 300 L150 180 L260 250 L360 140 L430 220" />
            <path d="M100 340 L200 230 L310 300 L400 190" />
            <circle cx="60" cy="300" r="7" />
            <circle cx="150" cy="180" r="7" />
            <circle cx="260" cy="250" r="7" />
            <circle cx="360" cy="140" r="7" />
            <circle cx="430" cy="220" r="7" />
            <rect x="130" y="330" width="55" height="36" rx="4" />
            <rect x="250" y="340" width="55" height="36" rx="4" />
            <rect x="360" y="325" width="55" height="36" rx="4" />
          </g>
        </svg>
      )
    case 'os-setup':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M40 320 H140 V220 H240 V300 H340 V180 H440" />
            <path d="M80 360 H200 V280 H300 V340 H400" />
            <circle cx="140" cy="220" r="6" />
            <circle cx="240" cy="300" r="6" />
            <circle cx="340" cy="180" r="6" />
            <circle cx="240" cy="240" r="34" />
            <circle cx="240" cy="240" r="14" />
          </g>
        </svg>
      )
    case 'security':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M240 100l70 24v56c0 42-28 72-70 88-42-16-70-46-70-88v-56l70-24z" />
            <rect x="220" y="300" width="40" height="32" rx="4" />
            <path d="M228 300v-12a12 12 0 0 1 24 0v12" />
            <path d="M80 340 H400" />
          </g>
        </svg>
      )
    case 'support':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <ellipse cx="240" cy="240" rx="70" ry="30" />
            <ellipse cx="240" cy="240" rx="120" ry="55" />
            <ellipse cx="240" cy="240" rx="170" ry="85" />
            <circle cx="100" cy="200" r="8" />
            <circle cx="380" cy="220" r="8" />
            <path d="M100 200 L180 300 L240 240 L320 290 L380 220" />
          </g>
        </svg>
      )
    case 'lifecycle-management':
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4">
            <circle cx="140" cy="240" r="70" />
            <circle cx="240" cy="220" r="85" />
            <circle cx="340" cy="240" r="70" />
            <path d="M140 170 A70 70 0 0 1 210 240" />
            <path d="M240 135 A85 85 0 0 1 325 220" />
            <path d="M340 170 A70 70 0 0 1 410 240" />
            <circle cx="140" cy="170" r="6" />
            <circle cx="240" cy="135" r="6" />
            <circle cx="340" cy="170" r="6" />
          </g>
        </svg>
      )
    default:
      return (
        <svg className="promo-line-motif" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g className="promo-line-draw" fill="none" stroke="currentColor" strokeWidth="2.4" data-uid={uid}>
            <path d="M60 360 V240 H110 V360 M130 360 V180 H200 V360 M220 360 V210 H280 V360 M300 360 V150 H380 V360" />
            <path d="M40 360 H440" />
          </g>
        </svg>
      )
  }
}
