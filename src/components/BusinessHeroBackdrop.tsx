import './BusinessHeroBackdrop.css'

/** Full-bleed futuristic animated hero background (replaces photo). */
export default function BusinessHeroBackdrop() {
  return (
    <div className="biz-hero-backdrop" aria-hidden="true">
      <div className="biz-hero-backdrop-sky" />
      <div className="biz-hero-backdrop-aurora biz-hero-backdrop-aurora-a" />
      <div className="biz-hero-backdrop-aurora biz-hero-backdrop-aurora-b" />
      <div className="biz-hero-backdrop-stars" />
      <div className="biz-hero-backdrop-beams" />

      <svg className="biz-hero-backdrop-city" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="bizCityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2433" />
            <stop offset="100%" stopColor="#070b12" />
          </linearGradient>
          <linearGradient id="bizCityGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbaf00" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fbaf00" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill="url(#bizCityFill)"
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
        <path
          className="biz-hero-backdrop-city-glow"
          fill="url(#bizCityGlow)"
          d="M0 300h1440v120H0z"
        />
      </svg>

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
