import './RecycleHeroArt.css'

/** Animated recycling mark for the recycling page hero — SecureFix palette. */
export default function RecycleHeroArt() {
  // One chase-arrow of the classic recycle mark (pointing up-right along the left side).
  // Drawn around center (100,100); duplicated at 0/120/240°.
  const arrow =
    'M78 48 L92 34 L92 42 C118 42 138 58 142 82 L156 78 L138 112 L104 98 L116 92 C112 74 98 62 78 60 Z'

  return (
    <div className="recycle-hero-art" aria-hidden="true">
      <div className="recycle-hero-art-glow" />
      <div className="recycle-hero-art-ring recycle-hero-art-ring-outer" />
      <div className="recycle-hero-art-ring recycle-hero-art-ring-inner" />

      <svg
        className="recycle-hero-art-svg"
        viewBox="0 0 200 200"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id="recycleFill" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffd24d" />
            <stop offset="50%" stopColor="#fbaf00" />
            <stop offset="100%" stopColor="#e09d00" />
          </linearGradient>
        </defs>

        <g className="recycle-hero-art-orbits">
          <circle className="recycle-hero-art-orbit-dot d1" cx="30" cy="70" r="3.2" />
          <circle className="recycle-hero-art-orbit-dot d2" cx="170" cy="98" r="2.6" />
          <circle className="recycle-hero-art-orbit-dot d3" cx="104" cy="176" r="3" />
          <path
            className="recycle-hero-art-dash a1"
            d="M44 46c18-20 46-28 72-20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="3 7"
          />
          <path
            className="recycle-hero-art-dash a2"
            d="M156 56c16 12 24 34 18 56"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="3 7"
          />
          <path
            className="recycle-hero-art-dash a3"
            d="M52 152c14 18 40 28 66 18"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="3 7"
          />
        </g>

        <g className="recycle-hero-art-symbol">
          {[0, 120, 240].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <path className="recycle-hero-art-arrow-shadow" d={arrow} transform="translate(2 3)" />
              <path className="recycle-hero-art-arrow" d={arrow} />
            </g>
          ))}
        </g>
      </svg>

      <p className="recycle-hero-art-caption">Secure · Reuse · Recycle</p>
    </div>
  )
}
