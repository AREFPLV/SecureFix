import type { BusinessHeroVariant } from '@/components/BusinessHeroArt'
import './BusinessHeroBackdrop.css'

type Props = {
  variant?: BusinessHeroVariant
}

function BackdropMotif({ variant, uid }: { variant: BusinessHeroVariant; uid: string }) {
  switch (variant) {
    case 'procurement':
      return (
        <svg className="biz-hero-backdrop-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2433" />
              <stop offset="100%" stopColor="#070b12" />
            </linearGradient>
          </defs>
          <g className="biz-hero-backdrop-crates">
            <rect className="biz-hero-backdrop-crate" x="120" y="250" width="90" height="70" rx="6" />
            <rect className="biz-hero-backdrop-crate" x="240" y="210" width="110" height="90" rx="6" />
            <rect className="biz-hero-backdrop-crate" x="390" y="240" width="80" height="65" rx="6" />
            <rect className="biz-hero-backdrop-crate" x="520" y="190" width="120" height="100" rx="6" />
            <rect className="biz-hero-backdrop-crate" x="700" y="230" width="95" height="75" rx="6" />
            <rect className="biz-hero-backdrop-crate" x="860" y="200" width="130" height="105" rx="6" />
            <rect className="biz-hero-backdrop-crate" x="1040" y="245" width="85" height="70" rx="6" />
            <rect className="biz-hero-backdrop-crate" x="1180" y="215" width="115" height="95" rx="6" />
          </g>
          <path
            className="biz-hero-backdrop-flow"
            d="M80 300 C260 220, 420 360, 620 280 S980 200, 1360 290"
          />
          <g className="biz-hero-backdrop-dots">
            <circle cx="220" cy="270" r="4" />
            <circle cx="480" cy="300" r="4" />
            <circle cx="760" cy="260" r="4" />
            <circle cx="1100" cy="285" r="4" />
          </g>
        </svg>
      )
    case 'deployment':
      return (
        <svg className="biz-hero-backdrop-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="biz-hero-backdrop-net">
            <path d="M180 280 L420 160 L720 240 L980 120 L1260 220" />
            <path d="M260 340 L520 220 L820 300 L1120 180" />
            <circle cx="180" cy="280" r="8" />
            <circle cx="420" cy="160" r="8" />
            <circle cx="720" cy="240" r="8" />
            <circle cx="980" cy="120" r="8" />
            <circle cx="1260" cy="220" r="8" />
            <circle cx="520" cy="220" r="6" />
            <circle cx="820" cy="300" r="6" />
            <circle cx="1120" cy="180" r="6" />
          </g>
          <g className="biz-hero-backdrop-devices">
            <rect x="390" y="300" width="70" height="46" rx="4" />
            <rect x="690" y="310" width="70" height="46" rx="4" />
            <rect x="990" y="295" width="70" height="46" rx="4" />
          </g>
        </svg>
      )
    case 'os-setup':
      return (
        <svg className="biz-hero-backdrop-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="biz-hero-backdrop-circuit">
            <path d="M100 320 H340 V220 H560 V300 H820 V180 H1100 V280 H1340" />
            <path d="M200 360 H480 V280 H700 V340 H980 V240 H1280" />
            <circle cx="340" cy="220" r="7" />
            <circle cx="560" cy="300" r="7" />
            <circle cx="820" cy="180" r="7" />
            <circle cx="1100" cy="280" r="7" />
            <circle cx="700" cy="340" r="6" />
            <circle cx="980" cy="240" r="6" />
          </g>
          <g className="biz-hero-backdrop-gears">
            <circle cx="640" cy="250" r="42" />
            <circle cx="640" cy="250" r="18" />
            <circle cx="860" cy="290" r="30" />
            <circle cx="860" cy="290" r="12" />
          </g>
        </svg>
      )
    case 'security':
      return (
        <svg className="biz-hero-backdrop-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="biz-hero-backdrop-shields">
            <path d="M240 140l70 24v56c0 42-28 72-70 88-42-16-70-46-70-88v-56l70-24z" />
            <path d="M720 110l90 30v70c0 52-36 90-90 110-54-20-90-58-90-110v-70l90-30z" />
            <path d="M1180 150l70 24v56c0 42-28 72-70 88-42-16-70-46-70-88v-56l70-24z" />
          </g>
          <g className="biz-hero-backdrop-locks">
            <rect x="450" y="280" width="40" height="32" rx="4" />
            <path d="M458 280v-12a12 12 0 0 1 24 0v12" />
            <rect x="950" y="270" width="40" height="32" rx="4" />
            <path d="M958 270v-12a12 12 0 0 1 24 0v12" />
          </g>
          <path className="biz-hero-backdrop-flow" d="M80 330 H1360" />
        </svg>
      )
    case 'support':
      return (
        <svg className="biz-hero-backdrop-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="biz-hero-backdrop-waves">
            <ellipse cx="720" cy="260" rx="120" ry="50" />
            <ellipse cx="720" cy="260" rx="200" ry="85" />
            <ellipse cx="720" cy="260" rx="300" ry="125" />
            <ellipse cx="720" cy="260" rx="420" ry="170" />
          </g>
          <g className="biz-hero-backdrop-signal">
            <circle cx="320" cy="220" r="10" />
            <circle cx="1120" cy="240" r="10" />
            <circle cx="520" cy="320" r="7" />
            <circle cx="940" cy="300" r="7" />
            <path d="M320 220 L520 320 L720 260 L940 300 L1120 240" />
          </g>
        </svg>
      )
    case 'lifecycle-management':
      return (
        <svg className="biz-hero-backdrop-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="biz-hero-backdrop-loops">
            <circle cx="360" cy="250" r="90" />
            <circle cx="720" cy="230" r="110" />
            <circle cx="1080" cy="250" r="90" />
            <path d="M360 160 A90 90 0 0 1 450 250" />
            <path d="M720 120 A110 110 0 0 1 830 230" />
            <path d="M1080 160 A90 90 0 0 1 1170 250" />
          </g>
          <g className="biz-hero-backdrop-dots">
            <circle cx="360" cy="160" r="8" />
            <circle cx="450" cy="250" r="8" />
            <circle cx="720" cy="120" r="8" />
            <circle cx="830" cy="230" r="8" />
            <circle cx="1080" cy="160" r="8" />
            <circle cx="1170" cy="250" r="8" />
          </g>
        </svg>
      )
    case 'industry':
      return (
        <svg className="biz-hero-backdrop-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2433" />
              <stop offset="100%" stopColor="#070b12" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${uid}-fill)`}
            d="M0 420V280h50v-80h40v80h60V160h50v-70h40v70h45v120h70V140h55v-50h35v50h50v140h80V180h60v-90h45v90h55v140h90V200h50v220H0z"
          />
          <g className="biz-hero-backdrop-windows">
            <rect x="140" y="220" width="6" height="8" />
            <rect x="220" y="180" width="6" height="8" />
            <rect x="360" y="150" width="6" height="8" />
            <rect x="520" y="160" width="6" height="8" />
            <rect x="700" y="170" width="6" height="8" />
            <rect x="880" y="140" width="6" height="8" />
            <rect x="1040" y="190" width="6" height="8" />
            <rect x="1180" y="160" width="6" height="8" />
          </g>
          <g className="biz-hero-backdrop-tags">
            <rect x="200" y="300" width="70" height="18" rx="9" />
            <rect x="520" y="290" width="80" height="18" rx="9" />
            <rect x="860" y="305" width="75" height="18" rx="9" />
            <rect x="1140" y="285" width="85" height="18" rx="9" />
          </g>
        </svg>
      )
    case 'business':
    default:
      return (
        <svg className="biz-hero-backdrop-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2433" />
              <stop offset="100%" stopColor="#070b12" />
            </linearGradient>
            <linearGradient id={`${uid}-glow`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbaf00" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#fbaf00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${uid}-fill)`}
            d="M0 420V250h40v-40h28v40h36v-90h24v-50h20v50h18v90h48V180h30v-70h22v70h26v70h40v-110h34v-40h18v40h22v110h56V140h40v-60h28v60h36v110h50V200h24v-80h20v80h30v50h44v-120h26v-30h16v30h22v120h60V160h38v260H0z"
          />
          <g className="biz-hero-backdrop-windows">
            <rect x="120" y="230" width="6" height="8" />
            <rect x="140" y="250" width="6" height="8" />
            <rect x="220" y="160" width="6" height="8" />
            <rect x="250" y="190" width="6" height="8" />
            <rect x="360" y="210" width="6" height="8" />
            <rect x="480" y="130" width="6" height="8" />
            <rect x="520" y="160" width="6" height="8" />
            <rect x="640" y="180" width="6" height="8" />
            <rect x="780" y="150" width="6" height="8" />
            <rect x="860" y="200" width="6" height="8" />
            <rect x="980" y="140" width="6" height="8" />
            <rect x="1020" y="170" width="6" height="8" />
            <rect x="1140" y="160" width="6" height="8" />
            <rect x="1260" y="190" width="6" height="8" />
          </g>
          <path className="biz-hero-backdrop-city-glow" fill={`url(#${uid}-glow)`} d="M0 300h1440v120H0z" />
        </svg>
      )
  }
}

/** Full-bleed futuristic animated hero background — service-themed (replaces photo). */
export default function BusinessHeroBackdrop({ variant = 'business' }: Props) {
  const uid = `bizBg-${variant}`

  return (
    <div className={`biz-hero-backdrop biz-hero-backdrop-${variant}`} aria-hidden="true">
      <div className="biz-hero-backdrop-sky" />
      <div className="biz-hero-backdrop-aurora biz-hero-backdrop-aurora-a" />
      <div className="biz-hero-backdrop-aurora biz-hero-backdrop-aurora-b" />
      <div className="biz-hero-backdrop-stars" />
      <div className="biz-hero-backdrop-beams" />

      <BackdropMotif variant={variant} uid={uid} />

      <div className="biz-hero-backdrop-grid" />
      <div className="biz-hero-backdrop-scan" />
      <div className="biz-hero-backdrop-particles">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="biz-hero-backdrop-shade" />
    </div>
  )
}
