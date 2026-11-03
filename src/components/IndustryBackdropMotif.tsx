/** Line-drawn industry motifs for Business IT solution heroes. */

type Props = {
  slug: string
  uid: string
}

export default function IndustryBackdropMotif({ slug, uid }: Props) {
  switch (slug) {
    case 'care-homes':
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="industry-draw industry-hospital" fill="none" stroke="currentColor" strokeWidth="2.2">
            {/* Hospital building with ambulance bay + medical cross */}
            <path d="M380 360 V200 H560 V130 H680 V100 H760 V130 H880 V200 H1060 V360" />
            <path d="M640 110 H800 M720 80 V160" />
            <rect x="440" y="230" width="42" height="52" />
            <rect x="520" y="230" width="42" height="52" />
            <rect x="880" y="230" width="42" height="52" />
            <rect x="960" y="230" width="42" height="52" />
            <path d="M680 360 V290 H760 V360" />
            <path d="M200 360 H1240" className="industry-ground" />
            <rect x="180" y="300" width="110" height="42" rx="6" />
            <circle cx="210" cy="348" r="10" />
            <circle cx="260" cy="348" r="10" />
            <circle cx="1120" cy="200" r="48" />
            <path d="M1120 172 V228 M1092 200 H1148" />
          </g>
        </svg>
      )
    case 'law-firms-solicitors':
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="industry-draw industry-law" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M720 120 V300" />
            <path d="M620 150 H820" />
            <path d="M640 150 Q600 210 580 260" />
            <path d="M800 150 Q840 210 860 260" />
            <circle cx="580" cy="270" r="28" />
            <circle cx="860" cy="270" r="28" />
            <path d="M680 300 H760 V360 H680 Z" />
            <path d="M520 360 H920" className="industry-ground" />
            <path d="M300 200 H420 M300 230 H400 M300 260 H410" />
            <path d="M1020 200 H1140 M1040 230 H1140 M1030 260 H1140" />
          </g>
        </svg>
      )
    case 'schools-education':
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="industry-draw industry-school" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M480 360 V220 L720 140 L960 220 V360" />
            <path d="M560 360 V260 H640 V360" />
            <rect x="700" y="250" width="50" height="40" />
            <rect x="800" y="250" width="50" height="40" />
            <path d="M720 140 V100" />
            <path d="M720 100 H760 L748 112" />
            <path d="M240 300 Q320 240 400 300" />
            <path d="M1040 300 Q1120 240 1200 300" />
            <path d="M200 360 H1240" className="industry-ground" />
          </g>
        </svg>
      )
    case 'cafes-restaurants':
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="industry-draw industry-cafe" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M520 360 V220 H920 V360" />
            <path d="M500 220 H940" />
            <path d="M520 220 L560 170 H880 L920 220" />
            <rect x="620" y="250" width="70" height="55" />
            <rect x="760" y="250" width="70" height="55" />
            <path d="M640 360 V310 H700 V360" />
            <circle cx="1080" cy="250" r="36" />
            <path d="M1080 214 C1100 230, 1100 250, 1080 270" />
            <path d="M240 280 C280 240, 300 240, 340 280" />
            <path d="M200 360 H1240" className="industry-ground" />
          </g>
        </svg>
      )
    case 'construction-sites':
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="industry-draw industry-build" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M320 360 V180 H420 V360" />
            <path d="M360 180 V120" />
            <path d="M360 120 H780" />
            <path d="M780 120 V240" />
            <path d="M760 240 H900" />
            <path d="M500 360 V260 H700 V360" />
            <path d="M980 360 L1040 280 L1100 360 Z" />
            <path d="M200 360 H1240" className="industry-ground" />
            <circle cx="360" cy="120" r="8" />
          </g>
        </svg>
      )
    case 'hotels-hostels':
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="industry-draw industry-hotel" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M500 360 V160 H940 V360" />
            <path d="M560 200 H620 M560 250 H620 M560 300 H620" />
            <path d="M700 200 H760 M700 250 H760 M700 300 H760" />
            <path d="M820 200 H880 M820 250 H880 M820 300 H880" />
            <path d="M680 360 V300 H760 V360" />
            <path d="M700 130 L720 100 L740 130 Z" />
            <path d="M200 360 H1240" className="industry-ground" />
          </g>
        </svg>
      )
    case 'airports':
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="industry-draw industry-airport" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M200 300 H1240" className="industry-ground" />
            <path d="M260 300 H420 M480 300 H640 M700 300 H860 M920 300 H1080" strokeDasharray="10 14" />
            <path d="M720 260 L860 220 L980 210 L1020 230 L940 250 L860 250 L780 280 Z" />
            <path d="M860 220 L820 160 L860 180" />
            <path d="M940 250 L980 300" />
            <circle cx="1120" cy="180" r="40" />
            <path d="M1120 160 V200 M1100 180 H1140" />
          </g>
        </svg>
      )
    case 'offices':
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <g className="industry-draw industry-office" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="520" y="180" width="400" height="180" rx="4" />
            <path d="M560 220 H880 M560 260 H880 M560 300 H880" />
            <rect x="640" y="310" width="70" height="50" />
            <path d="M300 360 V240 H420 V360" />
            <path d="M1020 360 V220 H1180 V360" />
            <path d="M200 360 H1240" className="industry-ground" />
          </g>
        </svg>
      )
    case 'businesses-corporate':
    default:
      return (
        <svg className="biz-hero-backdrop-motif industry-motif" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2433" />
              <stop offset="100%" stopColor="#070b12" />
            </linearGradient>
          </defs>
          <g className="industry-draw industry-corp" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M180 360 V240 H260 V360 M300 360 V180 H420 V360 M460 360 V210 H560 V360 M600 360 V150 H740 V360 M780 360 V200 H900 V360 M940 360 V170 H1080 V360 M1120 360 V230 H1260 V360" />
            <path d="M200 360 H1240" className="industry-ground" />
          </g>
        </svg>
      )
  }
}
