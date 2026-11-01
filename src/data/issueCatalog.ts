import { deviceCategories, type Brand, type DeviceCategory } from '@/data/booking'
import { listedModelNames, listedRepairs, shortJobName } from '@/data/listedPrices'
import { issuesByCategory, type RepairIssue } from '@/data/repairIssues'
import { getBatteryGradeOptions, getPremiumBatteryOption } from '@/data/batteryGrades'
import { getPremiumScreenOption, getScreenGradeOptions } from '@/data/screenGrades'
import { isGenericModel, slugify } from '@/lib/slugify'

export const CANONICAL_ORIGIN = 'https://securefix.uk'
export const SHOP_ADDRESS = '218 City Road, London EC1V 2PN'
export const LEGAL_NAME = 'SECUREFIX LTD'

/** Models with no parts price yet. Hubs can stay; priced fault pages are not published. */
const NOT_ISSUABLE_SLUGS = new Set(['iphone-duo'])

const DISPLAY_LABELS: Record<string, string> = {
  'Premium Screen Replacement': 'Screen Replacement',
  'BackGlass Replacement': 'Back glass replacement',
  'Standard Screen Replacement (INCELL)': 'INCELL',
  'Premium Screen Replacement (Soft OLED)': 'SOFT OLED',
  'Genuine Apple Screen Replacement': 'GENUINE APPLE',
  'Premium Battery Replacement': 'Premium Battery',
  'Genuine Apple Battery Replacement': 'Genuine Apple Battery',
}

/** Short card titles used on the booking issue picker (smartphone-style tiles). */
const BOOKING_CARD_LABELS: Record<string, string> = {
  'Premium Screen Replacement': 'Front Screen',
  'BackGlass Replacement': 'Back Glass',
  'Charging Unit Repair': 'Charging Dock',
  'Camera Lens Glass Repair': 'Rear Camera Lens',
  'Front Camera Replacement': 'Front Camera',
  'Rear Camera Replacement': 'Back Camera',
  'Audio Repair': 'Ear Speaker',
  'Power/Volume Button': 'Dead Condition',
  Diagnostics: 'Other Fault',
  'Mic Replacement': 'Microphone',
  'IC Replacement': 'Board / IC Repair',
  'Liquid Diagnostics': 'Liquid Damage',
}

const BLURBS: Record<string, (model: string) => string> = {
  'Premium Screen Replacement': (model) =>
    `The display assembly on the ${model} is replaced. Face ID or the fingerprint sensor is checked afterwards, and the phone is returned powered on.`,
  'Screen Replacement': (model) =>
    `The screen on the ${model} is replaced with a tested display assembly. The device is powered on and the picture and touch are checked before collection.`,
  'Screen Replacement (Switch)': (model) =>
    `The display on the ${model} is replaced. The console is powered on so the picture and touch are checked before collection.`,
  'Battery Replacement': (model) =>
    `A new cell is fitted in the ${model}, and the battery health reading is shown before collection.`,
  'Charging Unit Repair': (model) =>
    `The charging port on the ${model} is replaced or repaired, and the phone is tested with a cable before collection.`,
  'Charging Port Repair': (model) =>
    `The charging port on the ${model} is replaced or repaired, and the device is tested with a cable before collection.`,
  'HDMI Port Replacement': (model) =>
    `The HDMI port on the ${model} is replaced, and the console is tested on a screen for picture and sound.`,
  'Joystick / Drift Fix': (model) =>
    `The joystick mechanism on the ${model} is repaired or replaced, and both sticks are tested in the menu.`,
  'Audio Repair': (model) =>
    `The speaker or audio fault on the ${model} is repaired, and sound is played before you collect it.`,
  'BackGlass Replacement': (model) =>
    `The back glass on the ${model} is replaced and the camera opening is lined up. The device is powered on before handover.`,
  'Camera Lens Glass Repair': (model) =>
    `The camera lens glass on the ${model} is replaced, and the camera is opened to confirm it focuses.`,
  'Front Camera Replacement': (model) =>
    `The front camera on the ${model} is replaced. The camera is tested and, where the model has it, Face ID or the selfie picture is checked before collection.`,
  'Rear Camera Replacement': (model) =>
    `The rear camera on the ${model} is replaced, and a photo is taken to confirm focus before handover.`,
  'Mic Replacement': (model) =>
    `The microphone on the ${model} is replaced, and a short recording is played back before collection.`,
  'Power/Volume Button': (model) =>
    `The power or volume button on the ${model} is repaired or replaced, and both buttons are pressed to confirm they work.`,
  'Software Restore': (model) =>
    `The software on the ${model} is restored. The device is powered on and checked past the setup screen before collection.`,
  'Keyboard Replacement': (model) =>
    `The keyboard on the ${model} is replaced, and the keys are typed in a document before handover.`,
  'SSD / HDD Upgrade': (model) =>
    `An SSD or hard drive is fitted in the ${model}, and the computer is started to confirm the drive is detected.`,
  'RAM Upgrade': (model) =>
    `Memory is fitted in the ${model}, and the computer is started so the new capacity shows in the system report.`,
  'Fan / Overheating Fix': (model) =>
    `The fan and cooling path on the ${model} are cleaned or the fan is replaced, and the computer is run so the temperatures can be checked.`,
  'Hinge Repair': (model) =>
    `The hinge on the ${model} is repaired or replaced, and the lid is opened and closed to confirm it holds.`,
  'Touchpad Replacement': (model) =>
    `The touchpad on the ${model} is replaced, and the click and pointer are tested before collection.`,
  'Speaker Replacement': (model) =>
    `The speaker on the ${model} is replaced, and sound is played before handover.`,
  'Wi-Fi / Bluetooth Fix': (model) =>
    `The Wi-Fi or Bluetooth fault on the ${model} is repaired, and a network plus a wireless connection are tested before collection.`,
  'Virus / Malware Removal': (model) =>
    `Malware is removed from the ${model}. The computer is restarted and checked again before collection.`,
  'Windows / macOS Reinstall': (model) =>
    `Windows or macOS is reinstalled on the ${model}, and the computer is started to the desktop before handover.`,
  'Disc Drive Repair': (model) =>
    `The disc drive on the ${model} is repaired or replaced, and a disc is tested for read before collection.`,
  'Power Supply Repair': (model) =>
    `The power supply fault on the ${model} is repaired, and the console is powered on before handover.`,
  'Overheating / Fan Fix': (model) =>
    `The fan on the ${model} is cleaned or replaced, and the console is run to confirm it stays cool enough to play.`,
  'Controller Repair': (model) =>
    `The controller fault linked to the ${model} is repaired, and the buttons and sticks are tested in the menu.`,
  'SSD Upgrade': (model) =>
    `An SSD is fitted in the ${model}, and the console is started to confirm the drive is detected.`,
  'Software / System Restore': (model) =>
    `The system software on the ${model} is restored, and the console is powered on to the home menu before collection.`,
  'Home Button / Touch ID': (model) =>
    `The home button or Touch ID on the ${model} is repaired or replaced, and the button and fingerprint reader are tested.`,
  'Home Button Repair': (model) =>
    `The home button on the ${model} is repaired or replaced, and the button is tested before collection.`,
  'Audio / Headphone Jack': (model) =>
    `The headphone jack on the ${model} is repaired or replaced, and sound is tested with a cable.`,
  'Crown / Button Repair': (model) =>
    `The crown or side button on the ${model} is repaired, and the control is tested on the watch before handover.`,
  'Speaker / Mic Repair': (model) =>
    `The speaker or microphone on the ${model} is repaired, and sound in and out is tested before collection.`,
  'Band / Strap Connector': (model) =>
    `The strap connector on the ${model} is repaired or replaced, and a band is clicked in to confirm it locks.`,
  'Software / Reset': (model) =>
    `The software on the ${model} is reset, and the watch is powered on to confirm it starts.`,
  'Printer Repair': (model) =>
    `The fault on the ${model} is repaired, and a test page is printed before collection.`,
  'Printer Head Cleaning': (model) =>
    `The print head on the ${model} is cleaned, and a nozzle-check page is printed before handover.`,
  'Speaker / Audio Repair': (model) =>
    `The speaker on the ${model} is repaired, and audio is played before collection.`,
}

export type IssueFaq = { question: string; answer: string }
export type Crumb = { name: string; path?: string }
export type IssueLink = { label: string; path: string }

export type IssuePage = {
  categoryId: string
  categoryLabel: string
  brandId: string
  brandLabel: string
  model: string
  modelSlug: string
  issueLabel: string
  displayLabel: string
  issueSlug: string
  price: number
  priceText: string
  time: string
  path: string
  title: string
  description: string
  h1: string
  lead: string
  blurb: string
  outlook: string
  process: string[]
  included: string[]
  faqs: IssueFaq[]
  breadcrumbs: Crumb[]
  related: IssueLink[]
  bookingPath: string
  jsonLd: Record<string, unknown>
}

export function issueSlug(label: string): string {
  return label
    .replace(/BackGlass/g, 'Back Glass')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function displayIssueLabel(label: string): string {
  if (DISPLAY_LABELS[label]) return DISPLAY_LABELS[label]
  if (!label.includes(' ') && /[a-z][A-Z]/.test(label)) {
    const normalized = label
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
  }
  return label
}

/** Compact label for booking issue tiles (matches the smartphone picker reference). */
export function bookingCardLabel(label: string): string {
  if (BOOKING_CARD_LABELS[label]) return BOOKING_CARD_LABELS[label]

  const lower = label.toLowerCase()
  if (lower.includes('front screen') && lower.includes('battery')) return 'Screen + Battery'
  if (lower.includes('front screen')) return 'Front Screen'
  if (lower.includes('back glass') || lower.includes('backglass')) return 'Back Glass'
  if (lower.includes('charg') || lower.includes('dock')) return 'Charging Dock'
  if (lower.includes('ear') && lower.includes('speaker')) return 'Ear Speaker'
  if (lower.includes('dead') || (lower.includes("won't turn") && lower.includes('on'))) return 'Dead Condition'
  if (lower.includes('housing')) return 'Housing Replacement'
  if (lower.includes('rear') && lower.includes('lens')) return 'Rear Camera Lens'
  if (lower.includes('rear') && lower.includes('camera')) return 'Back Camera'
  if (lower.includes('front') && lower.includes('camera')) return 'Front Camera'

  const short = shortJobName(label)
  if (short !== label) {
    if (short === 'Screen replacement') return 'Front Screen'
    if (short === 'Battery replacement') return 'Battery Replacement'
    if (short === 'Charging port repair') return 'Charging Dock'
    if (short === 'Camera lens') return 'Rear Camera Lens'
    if (short === 'Rear camera') return 'Back Camera'
    if (short === 'Front camera') return 'Front Camera'
    if (short === 'Speaker repair') return 'Ear Speaker'
    if (short === 'Diagnostics') return 'Other Fault'
    return short
  }

  return displayIssueLabel(label)
}

export function isIssuableModel(label: string): boolean {
  return !NOT_ISSUABLE_SLUGS.has(slugify(label)) && !isGenericModel(label)
}

export function pricedIssues(categoryId: string): (RepairIssue & { price: number })[] {
  return (issuesByCategory[categoryId] ?? []).filter(
    (issue): issue is RepairIssue & { price: number } => typeof issue.price === 'number',
  )
}

function repairTime(categoryId: string, label: string): string {
  const lower = label.toLowerCase()
  if (categoryId === 'pc-laptop') {
    if (lower.includes('screen')) return '2h'
    if (lower.includes('battery') || lower.includes('ssd') || lower.includes('hard drive')) return '1h'
    return '1h 30m'
  }
  if (categoryId === 'tablet-ipad' || categoryId === 'smart-watch') return '1h'
  if (lower.includes('screen') || lower.includes('lcd') || lower.includes('battery')) return '30m'
  if (lower.includes('charg') || lower.includes('dock')) return '1h'
  return '1h'
}

export function issuePriceShown(issue: { price: number | null; priceText?: string }): string {
  if (issue.priceText) return issue.priceText
  if (issue.price == null) return 'Quote on inspection'
  return `from £${issue.price.toFixed(2)}`
}

function blurbFor(label: string, model: string): string {
  const known = BLURBS[label]
  if (known) return known(model)

  const lower = label.toLowerCase()
  if (lower.includes('screen') && lower.includes('battery')) {
    return `The display and battery on the ${model} are replaced in one visit when both parts are ready. Picture, touch, and battery health are checked before collection.`
  }
  if (lower.includes('screen') || lower.includes('lcd') || lower.includes('oled')) {
    return BLURBS['Premium Screen Replacement'](model)
  }
  if (lower.includes('back') && (lower.includes('glass') || lower.includes('cover'))) {
    return BLURBS['BackGlass Replacement'](model)
  }
  if (lower.includes('battery')) return BLURBS['Battery Replacement'](model)
  if (lower.includes('charg') || lower.includes('dock')) return BLURBS['Charging Unit Repair'](model)
  if (lower.includes('lens')) return BLURBS['Camera Lens Glass Repair'](model)
  if (lower.includes('front') && lower.includes('camera')) return BLURBS['Front Camera Replacement'](model)
  if (lower.includes('rear') && lower.includes('camera')) return BLURBS['Rear Camera Replacement'](model)
  if (lower.includes('speaker') || lower.includes('audio') || lower.includes('ear')) {
    return BLURBS['Audio Repair'](model)
  }
  if (lower.includes('mic')) return BLURBS['Mic Replacement'](model)
  if (lower.includes('software')) return BLURBS['Software Restore'](model)

  return `${displayIssueLabel(label)} for the ${model} is carried out at the shop. The device is tested before handover.`
}

/** Short repair description shown under the selected issue card on booking. */
export function issueBlurb(label: string, model: string): string {
  return blurbFor(label, model)
}

function outlookFor(label: string, model: string, display: string): string {
  const lower = label.toLowerCase()
  const fault = display.toLowerCase()
  if (lower.includes('screen') || lower.includes('lcd') || lower.includes('display')) {
    return `Most ${model} ${fault} jobs are completed in a single workshop visit when the matching display is ready. Picture, touch, and sensors are checked before you collect the device.`
  }
  if (lower.includes('battery')) {
    return `Most ${model} battery replacements are completed the same day when the matching cell is in stock. Battery health is checked before handover.`
  }
  if (lower.includes('charg') || lower.includes('dock')) {
    return `Most ${model} charging repairs are completed in one visit when the port or dock part is ready. The device is tested with a cable before collection.`
  }
  if (lower.includes('back') && (lower.includes('glass') || lower.includes('cover') || lower.includes('housing'))) {
    return `Most ${model} ${fault} jobs are completed in one workshop visit when the matching cover is ready. The device is powered on and checked before handover.`
  }
  if (lower.includes('hdmi')) {
    return `Most ${model} HDMI port repairs are completed in one workshop visit when the matching board or port is ready. Picture and sound are tested on a screen before collection.`
  }
  if (lower.includes('joystick') || lower.includes('drift')) {
    return `Most ${model} stick drift repairs are completed in one visit when the matching stick module is ready. Both sticks are tested in the menu before handover.`
  }
  if (lower.includes('liquid') || lower.includes('water')) {
    return `Liquid damage on the ${model} is assessed first so we can confirm what can be recovered. Many devices return to normal use after cleaning and parts replacement when corrosion is limited.`
  }
  if (lower.includes('diagnostic') || lower.includes("won't turn") || lower.includes('frozen')) {
    return `Diagnostics for the ${model} usually identify the fault in one workshop visit. Once the cause is clear, we confirm the repair price before any parts work starts.`
  }
  return `Most ${model} ${fault} jobs are completed in one workshop visit when the matching part is ready. The device is tested before handover, and this repair includes a 1-year warranty. Liquid damage is excluded.`
}

/** Step-by-step repair process shown on the SEO fault page. */
export function processStepsFor(label: string, model: string): string[] {
  const lower = label.toLowerCase()
  const display = displayIssueLabel(label).toLowerCase()

  if (lower.includes('screen') || lower.includes('lcd') || lower.includes('oled') || lower.includes('incell')) {
    return [
      `Book ${display} for your ${model} and choose drop-off, London collection, or mail-in.`,
      'We inspect the device and fit the selected display assembly.',
      'Picture, touch, and sensors are checked in the workshop.',
      'You collect the repaired phone, or we return it by collection or post.',
    ]
  }
  if (lower.includes('battery')) {
    return [
      `Book ${display} for your ${model} and choose drop-off, London collection, or mail-in.`,
      'We open the device and fit the selected battery cell.',
      'Battery health and charging are checked before handover.',
      'You collect the repaired phone, or we return it by collection or post.',
    ]
  }
  if (lower.includes('charg') || lower.includes('dock')) {
    return [
      `Book charging repair for your ${model} and choose how to send the device.`,
      'We diagnose the port or dock and replace the faulty part.',
      'The phone is tested with a cable to confirm a stable charge.',
      'The device is returned by drop-off collection, London collection, or mail.',
    ]
  }
  if (lower.includes('back') && (lower.includes('glass') || lower.includes('housing') || lower.includes('cover'))) {
    return [
      `Book ${display} for your ${model} and choose drop-off, collection, or mail-in.`,
      'We remove the damaged rear glass or housing and fit the replacement.',
      'Camera openings and fit are checked, then the phone is powered on.',
      'You collect the device or receive it back by collection or post.',
    ]
  }
  if (lower.includes('camera') || lower.includes('lens')) {
    return [
      `Book ${display} for your ${model} and choose how the device reaches the shop.`,
      'We replace the camera module or lens glass with a matching part.',
      'Focus and image quality are checked before handover.',
      'The repaired device is returned by drop-off, London collection, or mail.',
    ]
  }
  if (lower.includes('speaker') || lower.includes('audio') || lower.includes('ear') || lower.includes('mic')) {
    return [
      `Book ${display} for your ${model} and choose drop-off, collection, or mail-in.`,
      'We diagnose the audio path and replace the faulty speaker or microphone.',
      'Sound in and out is tested in the workshop.',
      'The device is handed back or returned by collection or post.',
    ]
  }
  if (
    lower.includes('liquid') ||
    lower.includes('water') ||
    lower.includes('diagnostic') ||
    lower.includes('frozen') ||
    lower.includes("won't turn") ||
    lower.includes('dead')
  ) {
    return [
      `Book diagnostics for your ${model} and choose drop-off, London collection, or mail-in.`,
      'We assess the fault and confirm what can be repaired before parts work starts.',
      'Agreed repairs are completed and the device is tested.',
      'You collect the phone or we return it by collection or post.',
    ]
  }
  return [
    `Book ${display} for your ${model} and choose drop-off, London collection, or mail-in.`,
    'We diagnose the fault and fit the matching part when stock is ready.',
    'The repair is tested in the workshop before handover.',
    'You collect the device, or we return it by London collection or mail.',
  ]
}

export function categoryHubPath(categoryId: string): string {
  if (categoryId === 'smartphone') return '/phone-repair'
  if (categoryId === 'pc-laptop') return '/computer-repair'
  if (categoryId === 'gaming-console') return '/console-repair'
  return `/repair/${categoryId}`
}

export function categoryHubLabel(categoryId: string): string {
  if (categoryId === 'smartphone') return 'Phone repair'
  if (categoryId === 'pc-laptop') return 'Computer repair'
  if (categoryId === 'gaming-console') return 'Console repair'
  return 'All repairs in this category'
}

function skipBrand(brand: Brand) {
  return brand.id.startsWith('other') || brand.label.toLowerCase().includes('other')
}

function issueRank(label: string) {
  const lower = label.toLowerCase()
  if (lower.includes('screen')) return 0
  if (lower.includes('battery')) return 1
  if (lower.includes('charg')) return 2
  if (lower.includes('backglass') || lower.includes('back glass')) return 3
  return 4
}

function metaDescription(model: string, display: string, shown: string, time: string) {
  const text = `${model} ${display.toLowerCase()} at ${shown}, usually ${time}, at 218 City Road, London EC1V. 1-year warranty, liquid damage excluded.`
  if (text.length < 140) return `${text} Collection across London.`
  return text
}

function buildOne(
  category: DeviceCategory,
  brand: Brand,
  model: string,
  issue: RepairIssue & { price: number },
  siblings: IssueLink[],
): IssuePage {
  const modelSlug = slugify(model)
  const slug = issueSlug(issue.label)
  const display = displayIssueLabel(issue.label)
  const shown = issuePriceShown(issue)
  const path = `/repair/${category.id}/${brand.id}/${modelSlug}/${slug}`
  const canonical = `${CANONICAL_ORIGIN}${path}`
  const h1 = `${model} ${display}`
  const hub = `/repair/${category.id}/${brand.id}/${modelSlug}`
  const brandPath = `/repair/${category.id}/${brand.id}`
  const catPath = categoryHubPath(category.id)
  const fault = display.toLowerCase()
  const lead = `${display} for the ${model} is carried out at ${SHOP_ADDRESS}, priced at ${shown}, with a workshop time of ${issue.time}, and a 1-year warranty.`
  const faqs: IssueFaq[] = [
    {
      question: `How much does ${model} ${fault} cost?`,
      answer: `${model} ${fault} is ${shown} at ${SHOP_ADDRESS}.`,
    },
    {
      question: `How long does ${model} ${fault} take?`,
      answer: `${model} ${fault} is listed at ${issue.time} on the SecureFix price list.`,
    },
    {
      question: `Is there a warranty on ${model} ${fault}?`,
      answer: `Yes. ${model} ${fault} includes a 1-year warranty. Liquid damage is excluded.`,
    },
    {
      question: `Can SecureFix fix ${model} ${fault}?`,
      answer: outlookFor(issue.label, model, display),
    },
  ]
  const breadcrumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: category.label, path: catPath },
    { name: brand.label, path: brandPath },
    { name: model, path: hub },
    { name: display },
  ]
  const related: IssueLink[] = [
    ...siblings.filter((item) => item.path !== path),
    { label: `${model} repair`, path: hub },
    { label: categoryHubLabel(category.id), path: catPath },
  ]
  const process = processStepsFor(issue.label, model)
  return {
    categoryId: category.id,
    categoryLabel: category.label,
    brandId: brand.id,
    brandLabel: brand.label,
    model,
    modelSlug,
    issueLabel: issue.label,
    displayLabel: display,
    issueSlug: slug,
    price: issue.price,
    priceText: shown,
    time: issue.time,
    path,
    title: `${h1} in London | ${shown} | SecureFix EC1V`,
    description: metaDescription(model, display, shown, issue.time),
    h1,
    lead,
    blurb: blurbFor(issue.label, model),
    outlook: outlookFor(issue.label, model, display),
    process,
    included: [
      `${display} for the ${model}`,
      'A test before handover',
      '1-year warranty (liquid damage is excluded)',
      'Drop-off, London collection, or mail-in',
    ],
    faqs,
    breadcrumbs,
    related,
    bookingPath: `${path}#book`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `${CANONICAL_ORIGIN}${crumb.path ?? path}`,
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        },
        {
          '@type': 'HowTo',
          name: `How ${h1} works at SecureFix`,
          step: process.map((text, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: `Step ${index + 1}`,
            text,
          })),
        },
        {
          '@type': 'Service',
          name: h1,
          description: metaDescription(model, display, shown, issue.time),
          provider: {
            '@type': 'Organization',
            name: LEGAL_NAME,
            url: `${CANONICAL_ORIGIN}/`,
          },
          areaServed: {
            '@type': 'Place',
            name: SHOP_ADDRESS,
            address: {
              '@type': 'PostalAddress',
              streetAddress: '218 City Road',
              addressLocality: 'London',
              postalCode: 'EC1V 2PN',
              addressCountry: 'GB',
            },
          },
          offers: {
            '@type': 'Offer',
            price: issue.price.toFixed(2),
            priceCurrency: 'GBP',
            url: canonical,
            availability: 'https://schema.org/InStock',
          },
        },
      ],
    },
  }
}

function gradeIssuesForModel(
  categoryId: string,
  brandId: string,
  model: string,
): (RepairIssue & { price: number })[] {
  if (categoryId !== 'smartphone') return []
  const picker = smartphonePickerIssues(brandId, model)
  const extras: (RepairIssue & { price: number })[] = []
  const isApple = brandId === 'apple-phone'

  const screenBase = picker.find((item) => item.cardTitle === 'Front Screen')
  if (screenBase && typeof screenBase.price === 'number') {
    const screenGrades = isApple
      ? getScreenGradeOptions(screenBase)
      : getPremiumScreenOption(screenBase)
    for (const grade of screenGrades) {
      if (typeof grade.price !== 'number') continue
      extras.push({
        label: grade.label,
        price: grade.price,
        priceText: grade.priceText,
        time: screenBase.time,
      })
    }
  }

  const batteryBase = picker.find((item) => item.cardTitle === 'Battery Replacement')
  if (batteryBase && typeof batteryBase.price === 'number') {
    const batteryGrades = isApple
      ? getBatteryGradeOptions(batteryBase)
      : getPremiumBatteryOption(batteryBase)
    for (const grade of batteryGrades) {
      if (typeof grade.price !== 'number') continue
      extras.push({
        label: grade.label,
        price: grade.price,
        priceText: grade.priceText,
        time: batteryBase.time,
      })
    }
  }

  return extras
}

function buildIssuePages(): IssuePage[] {
  const pages: IssuePage[] = []
  for (const category of deviceCategories) {
    for (const brand of category.brands) {
      if (skipBrand(brand)) continue
      for (const model of brand.models) {
        if (!isIssuableModel(model)) continue
        const listed = bookingIssues(category.id, brand.id, model).filter(
          (issue): issue is RepairIssue & { price: number } => typeof issue.price === 'number',
        )
        const grades = gradeIssuesForModel(category.id, brand.id, model)
        const seen = new Set(listed.map((issue) => issueSlug(issue.label)))
        const issues = [
          ...listed,
          ...grades.filter((issue) => !seen.has(issueSlug(issue.label))),
        ]
        const modelSlug = slugify(model)
        const siblings = issues.map((issue) => ({
          label: displayIssueLabel(issue.label),
          path: `/repair/${category.id}/${brand.id}/${modelSlug}/${issueSlug(issue.label)}`,
        }))
        for (const issue of issues) {
          pages.push(buildOne(category, brand, model, issue, siblings))
        }
      }
    }
  }
  return pages
}

let cached: IssuePage[] | null = null
let byPath: Map<string, IssuePage> | null = null

export function getIssuePages(): IssuePage[] {
  if (!cached) {
    cached = buildIssuePages()
    byPath = new Map(cached.map((page) => [page.path, page]))
  }
  return cached
}

export function getIssuePage(path: string): IssuePage | undefined {
  getIssuePages()
  return byPath?.get(path)
}

export type RepairTreeModel = {
  label: string
  path: string
  issuable: boolean
  issues: IssueLink[]
}

export type RepairTree = {
  id: string
  label: string
  path: string
  brands: {
    id: string
    label: string
    path: string
    models: RepairTreeModel[]
  }[]
}[]

export function repairTree(): RepairTree {
  return deviceCategories.map((category) => ({
    id: category.id,
    label: category.label,
    path: categoryHubPath(category.id),
    brands: category.brands
      .filter((brand) => !skipBrand(brand))
      .map((brand) => ({
        id: brand.id,
        label: brand.label,
        path: `/repair/${category.id}/${brand.id}`,
        models: brand.models
          .filter((model) => !isGenericModel(model))
          .map((model) => {
            const modelSlug = slugify(model)
            const issuable = isIssuableModel(model)
            const issues = issuable
              ? bookingIssues(category.id, brand.id, model).map((issue) => ({
                  label: `${displayIssueLabel(issue.label)} ${issuePriceShown(issue)}`,
                  path: `/repair/${category.id}/${brand.id}/${modelSlug}/${issueSlug(issue.label)}`,
                }))
              : []
            return {
              label: model,
              path: `/repair/${category.id}/${brand.id}/${modelSlug}`,
              issuable,
              issues,
            }
          }),
      })),
  }))
}

const OTHER_BRAND_ISSUES: Record<string, string[]> = {
  printer: ['Printer Repair', 'Printer Head Cleaning'],
  speaker: ['Speaker / Audio Repair'],
  drone: ['Drone Repair', 'Diagnostics'],
  'data-recovery': [
    'Data Recovery, HDD',
    'Data Recovery, SSD',
    'Data Recovery, USB / SD',
    'Diagnostics',
  ],
  'other-device': ['Other Device Repair', 'Diagnostics'],
}

function withQuoteText(issue: RepairIssue): RepairIssue & { price: number | null } {
  if (issue.price != null || issue.priceText) return issue
  return { ...issue, priceText: 'Quote on inspection' }
}

/** Fixed smartphone picker tiles — only the repairs from the booking reference image. */
export const SMARTPHONE_PICKER_SLOTS = [
  'Front Screen',
  'Back Glass',
  'Charging Dock',
  'Battery Replacement',
  'Other Fault',
  'Ear Speaker',
  'Dead Condition',
  'Front Camera',
  'Back Camera',
  'Housing Replacement',
  'Rear Camera Lens',
] as const

export type SmartphonePickerSlot = (typeof SMARTPHONE_PICKER_SLOTS)[number]

type PickerIssue = RepairIssue & { cardTitle: SmartphonePickerSlot }

function matchSmartphoneSlot(label: string, slot: SmartphonePickerSlot): boolean {
  const lower = label.toLowerCase()
  switch (slot) {
    case 'Front Screen':
      return (
        (lower.includes('screen') || lower.includes('lcd') || lower.includes('oled')) &&
        !lower.includes('battery') &&
        !lower.includes('back glass') &&
        !lower.includes('inner') &&
        !lower.includes('outer') &&
        !lower.includes('tempered') &&
        !lower.includes('protection') &&
        !lower.includes('add-on') &&
        !lower.includes('addon')
      )
    case 'Back Glass':
      return (
        (lower.includes('back glass') || lower.includes('backglass')) &&
        !lower.includes('housing') &&
        !lower.includes('full body') &&
        !lower.includes('screen')
      )
    case 'Charging Dock':
      return lower.includes('charg') || lower.includes('dock')
    case 'Battery Replacement':
      return lower.includes('battery') && !lower.includes('screen')
    case 'Other Fault':
      return (
        lower.includes('frozen') ||
        lower.includes('diagnostic') ||
        lower.includes("i don't know") ||
        lower.includes('other fault')
      )
    case 'Ear Speaker':
      return (
        lower.includes('loudspeaker') ||
        lower.includes('ear speaker') ||
        lower.includes('earpiece') ||
        ((lower.includes('speaker') || lower.includes('audio')) && !lower.includes('mic'))
      )
    case 'Dead Condition':
      return (
        lower.includes("won't turn") ||
        lower.includes('wont turn') ||
        lower.includes('dead') ||
        lower.includes('power button') ||
        lower.includes('no power')
      )
    case 'Front Camera':
      return lower.includes('front camera') || lower.includes('face id')
    case 'Back Camera':
      return (
        (lower.includes('rear') || lower.includes('back')) &&
        lower.includes('camera') &&
        !lower.includes('lens') &&
        !lower.includes('glass lens')
      )
    case 'Housing Replacement':
      return lower.includes('housing') || lower.includes('full body') || lower.includes('bent')
    case 'Rear Camera Lens':
      return lower.includes('lens')
    default:
      return false
  }
}

const SLOT_FALLBACKS: Record<SmartphonePickerSlot, string> = {
  'Front Screen': 'Premium Screen Replacement',
  'Back Glass': 'BackGlass Replacement',
  'Charging Dock': 'Charging Unit Repair',
  'Battery Replacement': 'Battery Replacement',
  'Other Fault': 'Diagnostics',
  'Ear Speaker': 'Audio Repair',
  'Dead Condition': 'Power/Volume Button',
  'Front Camera': 'Front Camera Replacement',
  'Back Camera': 'Rear Camera Replacement',
  'Housing Replacement': 'BackGlass Replacement',
  'Rear Camera Lens': 'Camera Lens Glass Repair',
}

function screenMatchRank(label: string): number {
  const lower = label.toLowerCase()
  if (lower.includes('soft oled') || lower.includes('oled/compatible') || lower.includes('premium quality')) {
    return 0
  }
  if (lower.includes('new screen') || lower.includes('screen replacement')) return 1
  if (lower.includes('lcd')) return 2
  return 3
}

function pickBestMatch(
  repairs: RepairIssue[],
  slot: SmartphonePickerSlot,
): RepairIssue | undefined {
  const matches = repairs.filter((repair) => matchSmartphoneSlot(repair.label, slot))
  if (!matches.length) return undefined
  // Prefer Soft OLED / Premium screen lines, then a concrete price, then shorter labels.
  return [...matches].sort((a, b) => {
    if (slot === 'Front Screen') {
      const ar = screenMatchRank(a.label)
      const br = screenMatchRank(b.label)
      if (ar !== br) return ar - br
    }
    const ap = typeof a.price === 'number' ? 0 : 1
    const bp = typeof b.price === 'number' ? 0 : 1
    if (ap !== bp) return ap - bp
    return a.label.length - b.label.length
  })[0]
}

/**
 * Smartphone booking tiles: exactly the 11 reference repairs.
 * Maps each tile to the closest listed/catalog job for pricing and booking.
 */
export function smartphonePickerIssues(
  brandId?: string | null,
  model?: string | null,
): PickerIssue[] {
  const listed =
    brandId && model && !isGenericModel(model)
      ? listedRepairs('smartphone', brandId, model)
      : null

  const pool: RepairIssue[] = listed?.length
    ? listed.map((repair) => ({
        label: repair.label,
        price: repair.price,
        priceText: repair.priceText,
        time: repairTime('smartphone', repair.label),
      }))
    : (issuesByCategory.smartphone ?? []).map(withQuoteText)

  return SMARTPHONE_PICKER_SLOTS.map((slot) => {
    const matched = pickBestMatch(pool, slot)
    if (matched) {
      return { ...matched, cardTitle: slot }
    }

    const fallbackLabel = SLOT_FALLBACKS[slot]
    const catalog = (issuesByCategory.smartphone ?? []).find((issue) => issue.label === fallbackLabel)
    return {
      label: catalog?.label ?? fallbackLabel,
      price: catalog?.price ?? null,
      priceText: catalog?.priceText ?? (catalog?.price == null ? 'Quote on inspection' : undefined),
      time: catalog?.time ?? repairTime('smartphone', fallbackLabel),
      cardTitle: slot,
    }
  })
}

/** Repairs for one model. Listed brands use that model's price list; generic/other fall back to category issues (including quote-only jobs). */
export function bookingIssues(categoryId: string, brandId?: string | null, model?: string | null) {
  if (brandId && model && !isGenericModel(model)) {
    const listed = listedRepairs(categoryId, brandId, model)
    if (listed?.length) {
      return listed.map((repair) => ({
        label: repair.label,
        price: repair.price,
        priceText: repair.priceText,
        time: repairTime(categoryId, repair.label),
      }))
    }
  }

  const allowQuoteOnly = Boolean(model && isGenericModel(model)) || categoryId === 'other'
  const source = allowQuoteOnly
    ? (issuesByCategory[categoryId] ?? []).map(withQuoteText)
    : pricedIssues(categoryId)

  return source
    .filter((issue) => {
      if (categoryId === 'other' && brandId && OTHER_BRAND_ISSUES[brandId]) {
        return OTHER_BRAND_ISSUES[brandId].includes(issue.label)
      }
      if (categoryId === 'gaming-console' && brandId !== 'nintendo') {
        return !/\(switch\)/i.test(issue.label)
      }
      if (!allowQuoteOnly && typeof issue.price !== 'number') return false
      return true
    })
    .sort((a, b) => issueRank(a.label) - issueRank(b.label) || a.label.localeCompare(b.label))
}

export function jobLabelsFor(categoryId: string, brandId?: string, model?: string): string[] {
  const sample =
    brandId && !model ? listedModelNames(categoryId, brandId)?.[0] : undefined
  const issues =
    brandId && (model || sample)
      ? bookingIssues(categoryId, brandId, model || sample)
      : pricedIssues(categoryId)
  const names: string[] = []
  for (const issue of issues) {
    const name = shortJobName(issue.label)
    if (!names.includes(name)) names.push(name)
    if (names.length >= 8) break
  }
  return names
}

export type BookingSeed = {
  category: DeviceCategory | null
  brand: Brand | null
  model: string | null
  issue: RepairIssue | null
  step: 'device' | 'brand' | 'model' | 'issue' | 'book'
}

/** Path for the crawlable repair booking page. */
export function repairBookingPath(
  categoryId: string,
  brandId: string,
  model: string,
  issueLabel: string,
) {
  return `/repair/${categoryId}/${brandId}/${slugify(model)}/${issueSlug(issueLabel)}#book`
}

export function bookingSelectionFromQuery(params: URLSearchParams): BookingSeed {
  const category = deviceCategories.find((item) => item.id === params.get('category')) ?? null
  const brand = category?.brands.find((item) => item.id === params.get('brand')) ?? null
  const modelParam = params.get('model')
  let model =
    brand && modelParam
      ? (brand.models.find((item) => slugify(item) === modelParam) ?? null)
      : null
  // Single-model brands (Other Brand, etc.) skip straight to issues.
  if (!model && brand?.models.length === 1) model = brand.models[0]
  const issueParam = params.get('issue')
  let issue: RepairIssue | null = null
  if (category && model && issueParam) {
    issue =
      bookingIssues(category.id, brand?.id, model).find((item) => issueSlug(item.label) === issueParam) ??
      null

    // Grade bookings (iPhone tiers / other-brand Premium) resolve from derived labels.
    if (!issue && category.id === 'smartphone') {
      const picker = smartphonePickerIssues(brand?.id, model)
      const isApple = brand?.id === 'apple-phone'
      const screenBase =
        picker.find((item) => item.cardTitle === 'Front Screen') ??
        bookingIssues(category.id, brand?.id, model).find((item) => {
          const lower = item.label.toLowerCase()
          return (
            (lower.includes('screen') || lower.includes('lcd') || lower.includes('oled')) &&
            !lower.includes('battery') &&
            !lower.includes('back glass') &&
            !lower.includes('tempered') &&
            !lower.includes('protection') &&
            !lower.includes('add-on')
          )
        })
      const screenOptions = screenBase
        ? isApple
          ? getScreenGradeOptions(screenBase)
          : getPremiumScreenOption(screenBase)
        : []
      const screenGrade = screenOptions.find((item) => issueSlug(item.label) === issueParam)
      if (screenGrade) {
        issue = {
          label: screenGrade.label,
          price: screenGrade.price,
          priceText: screenGrade.priceText,
          time: screenBase?.time ?? '30m',
        }
      } else {
        const batteryBase =
          picker.find((item) => item.cardTitle === 'Battery Replacement') ??
          bookingIssues(category.id, brand?.id, model).find((item) => {
            const lower = item.label.toLowerCase()
            return lower.includes('battery') && !lower.includes('screen') && !lower.includes('deal')
          })
        const batteryOptions = batteryBase
          ? isApple
            ? getBatteryGradeOptions(batteryBase)
            : getPremiumBatteryOption(batteryBase)
          : []
        const batteryGrade = batteryOptions.find((item) => issueSlug(item.label) === issueParam)
        if (batteryGrade) {
          issue = {
            label: batteryGrade.label,
            price: batteryGrade.price,
            priceText: batteryGrade.priceText,
            time: batteryBase?.time ?? '30m',
          }
        }
      }
    }
  }

  let step: BookingSeed['step'] = 'device'
  const showForm = params.get('view') !== 'issue'
  if (category && brand && model && issue && showForm) step = 'book'
  else if (category && brand && model) step = 'issue'
  else if (category && brand) step = 'model'
  else if (category) step = 'brand'

  return { category, brand, model, issue, step }
}
