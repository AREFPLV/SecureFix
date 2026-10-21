type Props = {
  categoryId: string
  brandLabel: string
  model: string
  issueLabel: string
  displayLabel: string
}

type DeviceKind = 'phone' | 'tablet' | 'laptop' | 'watch' | 'console' | 'other'
type FaultKind =
  | 'screen'
  | 'back'
  | 'battery'
  | 'charging'
  | 'camera'
  | 'audio'
  | 'button'
  | 'liquid'
  | 'hdmi'
  | 'joystick'
  | 'keyboard'
  | 'software'
  | 'general'

function hash(value: string) {
  let total = 0
  for (let i = 0; i < value.length; i += 1) total = (total * 31 + value.charCodeAt(i)) >>> 0
  return total
}

function deviceKind(categoryId: string): DeviceKind {
  if (categoryId === 'smartphone') return 'phone'
  if (categoryId === 'tablet-ipad') return 'tablet'
  if (categoryId === 'pc-laptop') return 'laptop'
  if (categoryId === 'smart-watch') return 'watch'
  if (categoryId === 'gaming-console') return 'console'
  return 'other'
}

function faultKind(label: string): FaultKind {
  const lower = label.toLowerCase()
  if (/\bhdmi\b/.test(lower)) return 'hdmi'
  if (/joystick|drift/.test(lower)) return 'joystick'
  if (/keyboard/.test(lower)) return 'keyboard'
  if (/liquid|water/.test(lower)) return 'liquid'
  if (/battery/.test(lower)) return 'battery'
  if (/charg|dock/.test(lower)) return 'charging'
  if (/camera|lens/.test(lower)) return 'camera'
  if (/speaker|audio|loud|mic/.test(lower)) return 'audio'
  if (/button|volume|power|crown|home button/.test(lower)) return 'button'
  if (/back/.test(lower) && /(glass|cover|housing|body)/.test(lower)) return 'back'
  if (/screen|lcd|display|oled|glass/.test(lower) && !/lens/.test(lower)) return 'screen'
  if (/software|diagnostic|frozen|won't turn|ios|android/.test(lower)) return 'software'
  return 'general'
}

const ACCENT = '#fbaf00'
const BODY = '#1a1a1a'
const FRAME = '#3a3a3a'
const GLASS = '#dfe7ef'
const CRACK = '#fbaf00'
const MUTED = '#8a8a8a'

function CrackLines({ seed }: { seed: number }) {
  const paths = [
    `M 95 ${70 + (seed % 7)} L 118 110 L 105 150 L 130 190`,
    `M 118 110 L 145 95 L 160 130`,
    `M 105 150 L 78 165 L 92 205`,
    `M 130 190 L 155 210 L 140 235`,
    `M 145 95 L 170 80`,
  ]
  return (
    <g stroke={CRACK} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.95">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  )
}

function BatteryBadge() {
  return (
    <g transform="translate(98 130)">
      <rect x="0" y="0" width="44" height="26" rx="4" fill={BODY} stroke={ACCENT} strokeWidth="2" />
      <rect x="44" y="7" width="5" height="12" rx="1.5" fill={ACCENT} />
      <rect x="5" y="5" width="18" height="16" rx="2" fill={ACCENT} />
    </g>
  )
}

function ChargingGlow() {
  return (
    <g>
      <rect x="108" y="268" width="24" height="8" rx="2" fill={ACCENT} />
      <path
        d="M120 250 L112 262 H118 L114 274 L126 258 H119 Z"
        fill={ACCENT}
        opacity="0.95"
      />
    </g>
  )
}

function CameraBurst() {
  return (
    <g>
      <circle cx="168" cy="78" r="16" fill="none" stroke={ACCENT} strokeWidth="2.5" />
      <circle cx="168" cy="78" r="6" fill={ACCENT} />
      <path d="M152 66 L145 58 M184 66 L191 58 M152 90 L145 98 M184 90 L191 98" stroke={ACCENT} strokeWidth="2" />
    </g>
  )
}

function LiquidDrops() {
  return (
    <g fill={ACCENT} opacity="0.85">
      <path d="M90 120 C90 108 104 100 104 120 C104 132 90 132 90 120Z" />
      <path d="M128 150 C128 140 140 134 140 150 C140 160 128 160 128 150Z" />
      <path d="M156 118 C156 108 168 102 168 118 C168 128 156 128 156 118Z" />
    </g>
  )
}

function SpeakerWaves() {
  return (
    <g stroke={ACCENT} strokeWidth="2.5" fill="none" strokeLinecap="round">
      <path d="M150 140 C158 148 158 160 150 168" />
      <path d="M162 130 C176 144 176 164 162 178" />
      <path d="M174 120 C194 140 194 168 174 188" />
    </g>
  )
}

function ButtonGlow() {
  return (
    <g>
      <rect x="198" y="120" width="5" height="28" rx="2" fill={ACCENT} />
      <rect x="198" y="160" width="5" height="18" rx="2" fill={ACCENT} opacity="0.7" />
    </g>
  )
}

function SoftwareGlyph() {
  return (
    <g fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round">
      <rect x="95" y="120" width="50" height="50" rx="8" />
      <path d="M108 145 L118 155 L132 135" />
    </g>
  )
}

function BackShatter() {
  return (
    <g stroke={ACCENT} strokeWidth="2" fill="none" opacity="0.9">
      <path d="M70 90 L90 130 L75 170 L100 210" />
      <path d="M170 95 L155 140 L175 185" />
      <path d="M120 80 L125 160 L115 230" />
      <circle cx="120" cy="150" r="28" strokeDasharray="4 6" />
    </g>
  )
}

function HdmiPort() {
  return (
    <g>
      <rect x="95" y="210" width="50" height="18" rx="3" fill={BODY} stroke={ACCENT} strokeWidth="2" />
      <rect x="104" y="215" width="32" height="8" rx="1.5" fill={ACCENT} />
    </g>
  )
}

function JoystickDrift() {
  return (
    <g>
      <circle cx="95" cy="170" r="18" fill={FRAME} stroke={ACCENT} strokeWidth="2" />
      <circle cx="100" cy="164" r="7" fill={ACCENT} />
      <circle cx="145" cy="170" r="18" fill={FRAME} stroke={MUTED} strokeWidth="2" />
      <circle cx="145" cy="170" r="7" fill={MUTED} />
    </g>
  )
}

function KeyboardGlow() {
  return (
    <g>
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={55 + col * 13}
            y={168 + row * 12}
            width="10"
            height="8"
            rx="1.5"
            fill={row === 1 && col === 4 ? ACCENT : FRAME}
          />
        )),
      )}
    </g>
  )
}

function FaultOverlay({ kind, seed }: { kind: FaultKind; seed: number }) {
  if (kind === 'screen') return <CrackLines seed={seed} />
  if (kind === 'battery') return <BatteryBadge />
  if (kind === 'charging') return <ChargingGlow />
  if (kind === 'camera') return <CameraBurst />
  if (kind === 'liquid') return <LiquidDrops />
  if (kind === 'audio') return <SpeakerWaves />
  if (kind === 'button') return <ButtonGlow />
  if (kind === 'software') return <SoftwareGlyph />
  if (kind === 'back') return <BackShatter />
  if (kind === 'hdmi') return <HdmiPort />
  if (kind === 'joystick') return <JoystickDrift />
  if (kind === 'keyboard') return <KeyboardGlow />
  return (
    <g stroke={ACCENT} strokeWidth="2.5" fill="none">
      <circle cx="120" cy="150" r="22" />
      <path d="M120 138 V154 M120 162 V164" />
    </g>
  )
}

function PhoneDevice({ seed, fault }: { seed: number; fault: FaultKind }) {
  const notch = seed % 2 === 0
  return (
    <g>
      <rect x="58" y="28" width="124" height="244" rx="28" fill={BODY} stroke={FRAME} strokeWidth="3" />
      <rect x="66" y="48" width="108" height="196" rx="12" fill={GLASS} />
      {notch ? (
        <rect x="96" y="36" width="48" height="10" rx="5" fill={FRAME} />
      ) : (
        <circle cx="120" cy="40" r="4" fill={FRAME} />
      )}
      <circle cx="120" cy="258" r="8" fill={FRAME} />
      <FaultOverlay kind={fault} seed={seed} />
    </g>
  )
}

function TabletDevice({ seed, fault }: { seed: number; fault: FaultKind }) {
  return (
    <g>
      <rect x="40" y="40" width="160" height="210" rx="18" fill={BODY} stroke={FRAME} strokeWidth="3" />
      <rect x="50" y="52" width="140" height="176" rx="8" fill={GLASS} />
      <circle cx="120" cy="238" r="5" fill={FRAME} />
      <g transform="translate(0 -10) scale(1 0.92)">
        <FaultOverlay kind={fault} seed={seed} />
      </g>
    </g>
  )
}

function LaptopDevice({ seed, fault }: { seed: number; fault: FaultKind }) {
  return (
    <g>
      <rect x="42" y="36" width="156" height="108" rx="8" fill={BODY} stroke={FRAME} strokeWidth="3" />
      <rect x="50" y="44" width="140" height="88" rx="4" fill={GLASS} />
      <path d="M28 148 H212 L200 168 H40 Z" fill={FRAME} />
      <rect x="95" y="156" width="50" height="4" rx="2" fill={MUTED} />
      <g transform="translate(0 -20) scale(1 0.75)">
        <FaultOverlay kind={fault === 'keyboard' ? 'keyboard' : fault} seed={seed} />
      </g>
      {fault === 'keyboard' ? <KeyboardGlow /> : null}
    </g>
  )
}

function WatchDevice({ seed, fault }: { seed: number; fault: FaultKind }) {
  return (
    <g>
      <rect x="98" y="18" width="44" height="28" rx="8" fill={FRAME} />
      <rect x="98" y="214" width="44" height="28" rx="8" fill={FRAME} />
      <rect x="78" y="46" width="84" height="168" rx="28" fill={BODY} stroke={FRAME} strokeWidth="3" />
      <rect x="88" y="60" width="64" height="130" rx="18" fill={GLASS} />
      <circle cx="162" cy="110" r="6" fill={fault === 'button' ? ACCENT : FRAME} />
      <g transform="translate(0 10) scale(0.85)">
        <FaultOverlay kind={fault} seed={seed} />
      </g>
    </g>
  )
}

function ConsoleDevice({ seed, fault }: { seed: number; fault: FaultKind }) {
  return (
    <g>
      <rect x="36" y="70" width="168" height="110" rx="18" fill={BODY} stroke={FRAME} strokeWidth="3" />
      <rect x="52" y="88" width="70" height="44" rx="8" fill={GLASS} />
      <circle cx="150" cy="110" r="14" fill={FRAME} stroke={fault === 'joystick' ? ACCENT : MUTED} strokeWidth="2" />
      <circle cx="178" cy="128" r="10" fill={FRAME} />
      <FaultOverlay kind={fault} seed={seed} />
    </g>
  )
}

function OtherDevice({ seed, fault }: { seed: number; fault: FaultKind }) {
  return (
    <g>
      <rect x="55" y="55" width="130" height="150" rx="16" fill={BODY} stroke={FRAME} strokeWidth="3" />
      <rect x="68" y="70" width="104" height="90" rx="8" fill={GLASS} />
      <FaultOverlay kind={fault} seed={seed} />
    </g>
  )
}

export default function RepairHeroArt({
  categoryId,
  brandLabel,
  model,
  issueLabel,
  displayLabel,
}: Props) {
  const kind = deviceKind(categoryId)
  const fault = faultKind(issueLabel)
  const seed = hash(`${categoryId}|${model}|${issueLabel}`)
  const caption = `${model} · ${displayLabel}`

  return (
    <figure className="repair-hero-art" aria-label={caption}>
      <svg viewBox="0 0 240 300" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`repairGlow-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.28" />
            <stop offset="55%" stopColor={ACCENT} stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="240" height="300" rx="24" fill="#252525" />
        <circle cx="48" cy="42" r="56" fill={`url(#repairGlow-${seed})`} />
        <circle cx="210" cy="250" r="70" fill={`url(#repairGlow-${seed})`} />
        <g transform={`translate(${(seed % 5) - 2} ${(seed % 3) - 1})`}>
          {kind === 'phone' && <PhoneDevice seed={seed} fault={fault} />}
          {kind === 'tablet' && <TabletDevice seed={seed} fault={fault} />}
          {kind === 'laptop' && <LaptopDevice seed={seed} fault={fault} />}
          {kind === 'watch' && <WatchDevice seed={seed} fault={fault} />}
          {kind === 'console' && <ConsoleDevice seed={seed} fault={fault} />}
          {kind === 'other' && <OtherDevice seed={seed} fault={fault} />}
        </g>
        <text x="120" y="292" textAnchor="middle" fill={MUTED} fontSize="9" fontFamily="Montserrat, sans-serif">
          {brandLabel}
        </text>
      </svg>
      <figcaption className="repair-hero-art-caption">{caption}</figcaption>
    </figure>
  )
}
