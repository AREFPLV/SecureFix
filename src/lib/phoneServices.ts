import type { RepairIssue } from '@/data/repairIssues'
import { issuePriceShown } from '@/data/issueCatalog'

export type PhoneServiceGroup = {
  id: string
  title: string
  blurb: string
  /** Preferred repair for one-click book (Most Popular screen, etc.) */
  primary: RepairIssue
  options: RepairIssue[]
  fromPriceText: string
}

type GroupDef = {
  id: string
  title: string
  blurb: string
  rank: number
  match: (label: string) => boolean
}

const GROUPS: GroupDef[] = [
  {
    id: 'front-screen',
    title: 'Front Screen',
    blurb: 'Cracked glass, OLED / LCD display and touch faults',
    rank: 10,
    match: (l) => {
      const x = l.toLowerCase()
      if (/tempered|protection|protector|camera lens|lens replacement/.test(x)) return false
      if (/camera/.test(x) && !/screen/.test(x)) return false
      return /screen|oled|lcd|display/.test(x)
    },
  },
  {
    id: 'battery',
    title: 'Battery Replacement',
    blurb: 'Poor battery health, sudden shutdowns and swelling',
    rank: 20,
    match: (l) => {
      const x = l.toLowerCase()
      return /battery/.test(x) && !/screen/.test(x) && !/deal/.test(x)
    },
  },
  {
    id: 'charging',
    title: 'Charging Dock',
    blurb: 'Not charging, loose port or dock replacement',
    rank: 30,
    match: (l) => {
      const x = l.toLowerCase()
      // “Microphone … Dock Replacement” is audio, not a charging job.
      if (/microphone|\bmic\b/.test(x) && !/charg/.test(x)) return false
      return /charg|charging port|dock replacement|not charging/.test(x)
    },
  },
  {
    id: 'back-glass',
    title: 'Back Glass',
    blurb: 'Cracked rear glass replacement',
    rank: 40,
    match: (l) => {
      const x = l.toLowerCase()
      return /back glass|rear glass|back cover/.test(x) && !/screen/.test(x) && !/housing|full body/.test(x)
    },
  },
  {
    id: 'housing',
    title: 'Housing Replacement',
    blurb: 'Bent frame or full body / housing solution',
    rank: 50,
    match: (l) => /housing|full body|bent/.test(l.toLowerCase()),
  },
  {
    id: 'rear-lens',
    title: 'Rear Camera Lens',
    blurb: 'Cracked camera glass lens',
    rank: 60,
    match: (l) => /lens/.test(l.toLowerCase()),
  },
  {
    id: 'rear-camera',
    title: 'Back Camera',
    blurb: 'Rear camera module replacement',
    rank: 70,
    match: (l) => {
      const x = l.toLowerCase()
      return /(rear|back).*camera|camera.*rear|whole rear/.test(x) && !/lens/.test(x) && !/front/.test(x)
    },
  },
  {
    id: 'front-camera',
    title: 'Front Camera',
    blurb: 'Selfie / Face ID camera module',
    rank: 80,
    match: (l) => /front.*camera|selfie/.test(l.toLowerCase()),
  },
  {
    id: 'speaker',
    title: 'Ear / Loud Speaker',
    blurb: 'Call audio, earpiece or loudspeaker faults',
    rank: 90,
    match: (l) => /speaker|earpiece|audio|microphone|mic/.test(l.toLowerCase()),
  },
  {
    id: 'dead-liquid',
    title: 'Dead / Liquid Damage',
    blurb: 'No power, liquid damage diagnostics and recovery',
    rank: 100,
    match: (l) => {
      const x = l.toLowerCase()
      if (/tempered|phone case|case for protection/.test(x)) return false
      return /liquid|water|dead|won'?t turn|power|diagnostic|frozen/.test(x)
    },
  },
  {
    id: 'addons',
    title: 'Protection Add-ons',
    blurb: 'Tempered glass and cases with any repair',
    rank: 110,
    match: (l) => /tempered|phone case|case for protection|protector/.test(l.toLowerCase()),
  },
]

function parseMoney(issue: RepairIssue): number | null {
  if (typeof issue.price === 'number') return issue.price
  const text = issue.priceText ?? ''
  const m = text.replace(/,/g, '').match(/£\s*(\d+(?:\.\d+)?)/)
  return m ? Number(m[1]) : null
}

function preferScreenOption(options: RepairIssue[]): RepairIssue {
  const popular = options.find((o) => /most popular/i.test(o.label))
  if (popular) return popular
  const ranked = [...options].sort((a, b) => (parseMoney(a) ?? 9e9) - (parseMoney(b) ?? 9e9))
  return ranked[0]
}

/** Group a phone model’s priced repairs into iRepairZone-style service tiles. */
export function groupPhoneServices(issues: RepairIssue[]): PhoneServiceGroup[] {
  const used = new Set<string>()
  const groups: PhoneServiceGroup[] = []

  for (const def of GROUPS) {
    const options = issues.filter((issue) => def.match(issue.label) && !used.has(issue.label))
    if (!options.length) continue
    for (const issue of options) used.add(issue.label)

    const primary = preferScreenOption(options)
    const prices = options.map(parseMoney).filter((n): n is number => n != null).sort((a, b) => a - b)
    const fromPriceText =
      prices.length === 0
        ? issuePriceShown(primary)
        : prices.length === 1
          ? `£${prices[0].toFixed(2)}`
          : `from £${prices[0].toFixed(2)}`

    groups.push({
      id: def.id,
      title: def.title,
      blurb: def.blurb,
      primary,
      options,
      fromPriceText,
    })
  }

  const leftover = issues.filter((issue) => !used.has(issue.label))
  if (leftover.length) {
    const primary = leftover[0]
    const prices = leftover.map(parseMoney).filter((n): n is number => n != null).sort((a, b) => a - b)
    groups.push({
      id: 'other',
      title: 'Other Fault',
      blurb: 'Software, buttons, and other repairs we provide for this model',
      primary,
      options: leftover,
      fromPriceText:
        prices.length === 0
          ? issuePriceShown(primary)
          : prices.length === 1
            ? `£${prices[0].toFixed(2)}`
            : `from £${prices[0].toFixed(2)}`,
    })
  }

  return groups
}

/** Distinct labels for options inside a service tile (screen tiers, deals, etc.). */
export function phoneServiceOptionLabel(issue: RepairIssue): string {
  const label = issue.label
  const lower = label.toLowerCase()

  if (/tempered|protector|protection/.test(lower) && /screen|glass/.test(lower)) {
    return 'Tempered glass protector'
  }
  if (/phone case|case for protection/.test(lower)) return 'Protective case add-on'
  if (/screen/.test(lower) && /battery/.test(lower)) return 'Screen + battery deal'
  if (/screen/.test(lower) && /back glass|rear glass/.test(lower)) return 'Screen + back glass deal'
  if (/soft oled/.test(lower) && /most popular/.test(lower)) return 'Soft OLED screen (most popular)'
  if (/soft oled/.test(lower)) return 'Soft OLED screen'
  if (/hard oled/.test(lower)) return 'Hard OLED screen'
  if (/oled\/compatible|oled \/ compatible|oled\/compatible/.test(lower) && /most popular/.test(lower)) {
    return 'OLED / compatible screen (most popular)'
  }
  if (/oled/.test(lower) && /most popular/.test(lower)) return 'OLED screen (most popular)'
  if (/oled/.test(lower)) return 'OLED screen'
  if (/lcd/.test(lower) && /must work/.test(lower)) return 'Front glass only (LCD must work)'
  if (/lcd/.test(lower)) return 'LCD screen'
  if (/in-cell|incell/.test(lower)) return 'In-cell screen'
  if (/original|oem|genuine/.test(lower) && /screen|display|glass/.test(lower)) {
    return 'OEM / original screen'
  }
  if (/screen|display/.test(lower)) return 'Screen replacement'
  if (/battery/.test(lower)) return 'Battery replacement'
  if (/charg|dock/.test(lower) && !/mic/.test(lower)) return 'Charging port / dock'
  if (/back glass|rear glass/.test(lower) && /housing|full body|bent/.test(lower)) {
    return 'Back glass + housing'
  }
  if (/back glass|rear glass/.test(lower)) return 'Back glass'
  if (/lens/.test(lower)) return 'Camera lens glass'
  if (/front/.test(lower) && /camera|face id/.test(lower)) return 'Front camera / Face ID'
  if (/(rear|back)/.test(lower) && /camera/.test(lower)) return 'Rear camera module'
  if (/speaker|earpiece|audio/.test(lower)) return 'Speaker / audio'
  if (/microphone|mic/.test(lower)) return 'Microphone'
  if (/liquid|water/.test(lower)) return 'Liquid damage diagnostics'
  if (/won.?t turn|dead|diagnostic/.test(lower)) return 'Won’t turn on / diagnostics'
  if (/frozen/.test(lower)) return 'Frozen phone fix'
  if (/software|ios|logo/.test(lower)) return 'Software / iOS fix'
  if (/button/.test(lower)) return 'Buttons'
  if (/overheat/.test(lower)) return 'Overheating assessment'
  if (/bluetooth|wifi|gps|connection/.test(lower)) return 'Connectivity (Wi‑Fi / Bluetooth / GPS)'

  return label.length > 48 ? `${label.slice(0, 48).trim()}…` : label
}
