import { deviceCategories } from '@/data/booking'
import { accessories } from '@/data/accessories'
import { businessServices, businessServiceRoute } from '@/data/businessServices'
import { industrySolutions, industrySolutionRoute } from '@/data/industrySolutions'
import { jobLabelsFor } from '@/data/issueCatalog'
import { PRIVACY_ROUTE } from '@/data/privacy'
import { localCoverage } from '@/data/localCoverage'
import { isGenericModel, slugify } from '@/lib/slugify'
import {
  PHONE_REPAIR_ROUTE,
  COMPUTER_REPAIR_ROUTE,
  CONSOLE_REPAIR_ROUTE,
} from '@/data/serviceLandings'
import {
  BOOKING_ROUTE,
  ACCESSORIES_ROUTE,
  ABOUT_ROUTE,
  TRAINING_ROUTE,
  RECYCLING_ROUTE,
  LIFECYCLE_ROUTE,
  CALL_OUT_ROUTE,
  TRADE_IN_ROUTE,
  TERMS_ROUTE,
} from '@/data/content'

export type SeoPageKind =
  | 'static'
  | 'repair-category'
  | 'repair-brand'
  | 'repair-model'
  | 'product'
  | 'business'
  | 'industry'
  | 'recycling-topic'

export type SeoPageEntry = {
  kind: SeoPageKind
  path: string
  title: string
  description: string
  h1: string
  accent?: string
  intro: string[]
  bullets?: string[]
  relatedPaths?: { label: string; path: string }[]
  ctaPath?: string
  ctaLabel?: string
}

const SITE = 'https://securefix.uk'
const address = localCoverage.addressLine
const areas = localCoverage.neighborhoods.slice(0, 8).join(', ')

export const recyclingTopics = [
  {
    slug: 'phone-recycling',
    title: 'Phone Recycling London | Secure Data Wipe | SecureFix',
    image: '/images/recycling-phone-hero.jpg',
    h1: 'Phone Recycling',
    accent: 'London',
    description:
      'Secure phone recycling in London with certified data wipe. Drop off or collect near Old Street, Angel and City Road EC1V.',
    intro: [
      `SecureFix recycles iPhones, Samsung and Android phones with secure data destruction at ${address}.`,
      `We serve ${areas} and nearby postcodes including ${localCoverage.postcodes.join(', ')}.`,
    ],
    bullets: [
      'Certified data wipe before recycling',
      'iPhone, Samsung, Pixel and Android accepted',
      'WEEE-compliant processing',
      'Certificate of destruction for business jobs',
    ],
  },
  {
    slug: 'laptop-recycling',
    title: 'Laptop & Computer Recycling London | SecureFix',
    image: '/images/recycling-laptop-hero.jpg',
    h1: 'Laptop & Computer Recycling',
    accent: 'Secure & Compliant',
    description:
      'Laptop and PC recycling with secure hard-drive wipe in London EC1V. Ideal for office clear-outs near Farringdon and Barbican.',
    intro: [
      'Recycle MacBooks, Windows laptops, desktops and workstations with SecureFix. Storage media is wiped or destroyed before processing.',
      `Collection available across Greater London, with drop-off at ${address}.`,
    ],
    bullets: [
      'Mac & Windows laptop recycling',
      'Hard drive and SSD destruction',
      'Office IT clear-out support',
      'Compliance paperwork available',
    ],
  },
  {
    slug: 'tablet-recycling',
    title: 'iPad & Tablet Recycling London | SecureFix',
    image: '/images/recycling-tablet-hero.jpg',
    h1: 'iPad & Tablet Recycling',
    accent: 'Data-Safe',
    description:
      'Recycle iPads and Android tablets in London with secure data wipe. Serving EC1V, Old Street and Islington.',
    intro: [
      'SecureFix accepts iPads, Galaxy Tabs and Android tablets for responsible recycling after secure data handling.',
    ],
    bullets: ['iPad recycling', 'Android tablet recycling', 'Secure wipe options', 'London drop-off & collection'],
  },
  {
    slug: 'data-destruction',
    title: 'Certified Data Destruction London | SecureFix',
    image: '/images/recycling-data-destruction-hero.jpg',
    h1: 'Certified Data Destruction',
    accent: 'Business Ready',
    description:
      'Certified data destruction and media wiping for phones, laptops and hard drives in London EC1V. Certificates available.',
    intro: [
      'Protect customer and company data before recycling. SecureFix provides wiping and physical destruction with documentation for audits.',
    ],
    bullets: [
      'Phone, laptop and drive destruction',
      'Certificate of destruction',
      'Business and SME friendly',
      'Workshop at 218 City Rd',
    ],
  },
  {
    slug: 'it-asset-disposal',
    title: 'IT Asset Disposal London | SecureFix',
    image: '/images/recycling-it-asset-disposal-hero.jpg',
    h1: 'IT Asset Disposal',
    accent: 'Offices & SMEs',
    description:
      'IT asset disposal for London offices — phones, laptops, monitors and networking gear with secure recycling.',
    intro: [
      'From single devices to full office refreshes, SecureFix handles IT asset disposal with secure processing and clear reporting.',
    ],
    bullets: ['Office clear-outs', 'Mixed IT equipment', 'Secure chain of custody', 'London collection'],
  },
  {
    slug: 'hard-drive-destruction',
    title: 'Hard Drive & SSD Destruction London | SecureFix',
    image: '/images/recycling-hard-drive-hero.jpg',
    h1: 'Hard Drive & SSD Destruction',
    accent: 'Secure Wipe',
    description:
      'Hard drive and SSD destruction in London with secure wipe or physical destruction and optional certificates.',
    intro: [
      'Retiring servers or staff laptops? SecureFix can wipe or destroy HDDs and SSDs before recycling residual materials.',
    ],
    bullets: ['HDD destruction', 'SSD secure wipe', 'Business certificates', 'EC1V workshop'],
  },
  {
    slug: 'weee-recycling',
    title: 'WEEE Compliant Recycling London | SecureFix',
    image: '/images/recycling-weee-hero.jpg',
    h1: 'WEEE Compliant Recycling',
    accent: 'Responsible E-Waste',
    description:
      'WEEE compliant electronics recycling in London for homes and businesses. SecureFix, 218 City Rd, EC1V 2PN.',
    intro: [
      'We process electrical and electronic waste through responsible channels so materials can be recovered.',
    ],
    bullets: ['WEEE compliant', 'Phones to servers', 'Eco-focused recovery', 'London coverage'],
  },
  {
    slug: 'business-it-recycling',
    title: 'Business IT Recycling & Clear-Out London | SecureFix',
    image: '/images/recycling-business-it-hero.jpg',
    h1: 'Business IT Recycling',
    accent: 'Office Clear-Outs',
    description:
      'Business IT recycling and office clear-outs in London with data security, reporting and collection near City Road.',
    intro: [
      'SecureFix supports SMEs and corporate offices with secure device retirement, recycling and destruction paperwork.',
    ],
    bullets: ['Office clear-outs', 'Fleet device retirement', 'Audit-ready paperwork', 'Collection across London'],
  },
] as const

function skipBrand(id: string, label: string) {
  return id.startsWith('other') || label.toLowerCase().includes('other')
}

function categoryHubPath(categoryId: string) {
  if (categoryId === 'smartphone') return PHONE_REPAIR_ROUTE
  if (categoryId === 'pc-laptop') return COMPUTER_REPAIR_ROUTE
  if (categoryId === 'gaming-console') return CONSOLE_REPAIR_ROUTE
  return `/repair/${categoryId}`
}

export function buildSeoCatalog(): SeoPageEntry[] {
  const pages: SeoPageEntry[] = [
    {
      kind: 'static',
      path: '/',
      title: 'Mobile Phone, Computer & Console Repair EC1V | SecureFix London',
      description: `Same-day phone, PC, and PlayStation repair shop at ${address}.`,
      h1: 'SecureFix London',
      intro: [],
    },
    {
      kind: 'static',
      path: BOOKING_ROUTE,
      title: 'Book a Repair | SecureFix London',
      description: 'Book phone, laptop or console repair online with SecureFix London.',
      h1: 'Book a Repair',
      intro: [],
    },
    {
      kind: 'static',
      path: ACCESSORIES_ROUTE,
      title: 'Phone & Laptop Accessories London | SecureFix',
      description: 'Cases, chargers, screen protectors and accessories from SecureFix London.',
      h1: 'Accessories',
      intro: [],
    },
    {
      kind: 'static',
      path: ABOUT_ROUTE,
      title: 'About SecureFix | London Repair Shop',
      description: 'About SecureFix — phone, computer and console repair specialists in EC1V.',
      h1: 'About',
      intro: [],
    },
    {
      kind: 'static',
      path: TRAINING_ROUTE,
      title: 'Training Courses London | SecureFix',
      description:
        'Phone, tablet and laptop repair training courses at SecureFix London EC1V.',
      h1: 'Training Courses',
      intro: [],
    },
    {
      kind: 'static',
      path: RECYCLING_ROUTE,
      title: 'Device Recycling London | SecureFix',
      description: 'Secure IT recycling and data wipe in London EC1V.',
      h1: 'Recycling',
      intro: [],
    },
    {
      kind: 'static',
      path: LIFECYCLE_ROUTE,
      title: 'Business IT London | SecureFix for Business',
      description: 'Business laptop sourcing, deployment and lifecycle management in London.',
      h1: 'Business IT',
      intro: [],
    },
    {
      kind: 'static',
      path: CALL_OUT_ROUTE,
      title: 'Call-Out Repair London | SecureFix',
      description: 'On-site call-out repair and IT support across London.',
      h1: 'Call-Out',
      intro: [],
    },
    {
      kind: 'static',
      path: TRADE_IN_ROUTE,
      title: 'Trade-In Devices London | SecureFix',
      description: 'Trade in phones, tablets and laptops with SecureFix London.',
      h1: 'Trade-In',
      intro: [],
    },
    {
      kind: 'static',
      path: TERMS_ROUTE,
      title: 'Terms & Conditions | SecureFix',
      description:
        'Terms for SECUREFIX LTD repairs, including the 1-year repair warranty. Liquid damage is excluded.',
      h1: 'Terms',
      intro: [],
    },
    {
      kind: 'static',
      path: PRIVACY_ROUTE,
      title: 'Privacy policy | SecureFix',
      description:
        'How SECUREFIX LTD uses name, email, phone, device and fault details sent through the SecureFix forms.',
      h1: 'Privacy policy',
      intro: [],
    },
    {
      kind: 'static',
      path: PHONE_REPAIR_ROUTE,
      title: 'Express iPhone & Samsung Phone Repair Old Street | SecureFix',
      description: 'Same-day phone repair in City Road, EC1V.',
      h1: 'Phone Repair',
      intro: [],
    },
    {
      kind: 'static',
      path: COMPUTER_REPAIR_ROUTE,
      title: 'Laptop, Mac & PC Repair London EC1V | SecureFix',
      description: 'Computer repair near Old Street & Farringdon.',
      h1: 'Computer Repair',
      intro: [],
    },
    {
      kind: 'static',
      path: CONSOLE_REPAIR_ROUTE,
      title: 'PlayStation, Xbox & Switch Repair London | SecureFix',
      description: 'Console repair at 218 City Rd, EC1V.',
      h1: 'Console Repair',
      intro: [],
    },
    {
      kind: 'static',
      path: '/sitemap',
      title: 'HTML Sitemap | SecureFix London',
      description: 'Browse all SecureFix repair, product, business IT and recycling pages.',
      h1: 'Sitemap',
      intro: [],
    },
  ]

  for (const category of deviceCategories) {
    const sampleBrand = category.brands.find((brand) => !skipBrand(brand.id, brand.label))
    const issueLabels = jobLabelsFor(category.id, sampleBrand?.id)
    const catPath = `/repair/${category.id}`

    // Dedicated hubs already exist for phone/computer/console — still add brand/model trees under /repair/
    if (!['smartphone', 'pc-laptop', 'gaming-console'].includes(category.id)) {
      pages.push({
        kind: 'repair-category',
        path: catPath,
        title: `${category.label} Repair London EC1V | SecureFix`,
        description: `${category.description} Same-day ${category.label.toLowerCase()} repair at ${address}. Serving ${areas}.`,
        h1: `${category.label} Repair`,
        accent: 'London EC1V',
        intro: [
          `SecureFix repairs ${category.label.toLowerCase()} devices at ${address}, with walk-in and booking options for nearby London neighbourhoods.`,
          `Common jobs include ${issueLabels.join(', ') || 'diagnostics and parts replacement'}.`,
        ],
        bullets: issueLabels,
        ctaPath: BOOKING_ROUTE,
        ctaLabel: 'Book This Repair',
        relatedPaths: category.brands
          .filter((b) => !skipBrand(b.id, b.label))
          .slice(0, 12)
          .map((b) => ({
            label: `${b.label} Repair`,
            path: `${catPath}/${b.id}`,
          })),
      })
    }

    for (const brand of category.brands) {
      if (skipBrand(brand.id, brand.label)) continue
      const brandPath = `${catPath}/${brand.id}`
      const models = brand.models.filter((m) => !isGenericModel(m))
      pages.push({
        kind: 'repair-brand',
        path: brandPath,
        title: `${brand.label} Repair London | SecureFix EC1V`,
        description: `${brand.label} repair near Old Street and City Road. Screen, battery, charging and more at ${address}.`,
        h1: `${brand.label} Repair`,
        accent: 'SecureFix London',
        intro: [
          `Looking for ${brand.label} repair in London? SecureFix at ${address} offers diagnostics and same-day repairs where parts allow.`,
          `We cover ${areas} and postcodes ${localCoverage.postcodes.join(', ')}.`,
        ],
        bullets: [
          ...jobLabelsFor(category.id, brand.id).slice(0, 6),
          ...models.slice(0, 6).map((m) => `${m} repair`),
        ],
        ctaPath: BOOKING_ROUTE,
        ctaLabel: `Book ${brand.label} Repair`,
        relatedPaths: [
          { label: category.label, path: categoryHubPath(category.id) },
          ...models.map((m) => ({
            label: `${m} Repair`,
            path: `${brandPath}/${slugify(m)}`,
          })),
        ],
      })

      for (const model of models) {
        const modelSlug = slugify(model)
        const modelPath = `${brandPath}/${modelSlug}`
        pages.push({
          kind: 'repair-model',
          path: modelPath,
          title: `${model} Repair London | SecureFix EC1V`,
          description: `${model} repair in London at ${address}. Priced faults and workshop times from SecureFix.`,
          h1: `${model} Repair`,
          intro: [`${model} repairs at ${address}.`],
          bullets: jobLabelsFor(category.id, brand.id, model),
          ctaPath: `${BOOKING_ROUTE}?category=${category.id}&brand=${brand.id}&model=${modelSlug}`,
          ctaLabel: `Book ${model} Repair`,
          relatedPaths: [
            { label: `${brand.label} repairs`, path: brandPath },
            { label: category.label, path: categoryHubPath(category.id) },
          ],
        })
      }
    }
  }

  for (const product of accessories) {
    const slug = `${product.id}-${slugify(product.name)}`
    pages.push({
      kind: 'product',
      path: `/products/${slug}`,
      title: `${product.name} | Buy in London | SecureFix`,
      description: `${product.name} (${product.brand}) — ${product.compatibility}. Available from SecureFix, ${address}.`,
      h1: product.name,
      accent: product.brand,
      intro: [
        `Buy the ${product.name} from SecureFix in London. Compatibility: ${product.compatibility}.`,
        `Collect from ${address} or ask about delivery options when you contact us.`,
      ],
      bullets: [
        `Brand: ${product.brand}`,
        `Category: ${product.category}`,
        `Compatibility: ${product.compatibility}`,
        `Price: £${product.price.toFixed(2)}`,
      ],
      ctaPath: ACCESSORIES_ROUTE,
      ctaLabel: 'View Accessories Shop',
      relatedPaths: [
        { label: 'All accessories', path: ACCESSORIES_ROUTE },
        { label: 'Phone repair', path: PHONE_REPAIR_ROUTE },
        { label: 'Book a repair', path: BOOKING_ROUTE },
      ],
    })
  }

  for (const service of businessServices) {
    pages.push({
      kind: 'business',
      path: businessServiceRoute(service.slug),
      title: `${service.cardTitle} London | SecureFix for Business`,
      description: service.cardDescription,
      h1: service.cardTitle,
      accent: 'Business IT',
      intro: [service.hero.subtitle, service.intro],
      bullets: service.highlights,
      ctaPath: LIFECYCLE_ROUTE,
      ctaLabel: 'Business IT Hub',
      relatedPaths: businessServices
        .filter((s) => s.slug !== service.slug)
        .map((s) => ({ label: s.cardTitle, path: businessServiceRoute(s.slug) })),
    })
  }

  for (const industry of industrySolutions) {
    pages.push({
      kind: 'industry',
      path: industrySolutionRoute(industry.slug),
      title: industry.title,
      description: industry.description,
      h1: industry.h1,
      accent: industry.accent,
      intro: [industry.intro],
      bullets: industry.services,
      ctaPath: LIFECYCLE_ROUTE,
      ctaLabel: 'Business IT Hub',
      relatedPaths: industrySolutions
        .filter((item) => item.slug !== industry.slug)
        .slice(0, 8)
        .map((item) => ({ label: item.label, path: industrySolutionRoute(item.slug) })),
    })
  }

  for (const topic of recyclingTopics) {
    pages.push({
      kind: 'recycling-topic',
      path: `/recycling/${topic.slug}`,
      title: topic.title,
      description: topic.description,
      h1: topic.h1,
      accent: topic.accent,
      intro: [...topic.intro],
      bullets: [...topic.bullets],
      ctaPath: RECYCLING_ROUTE,
      ctaLabel: 'Recycling Quote',
      relatedPaths: recyclingTopics
        .filter((t) => t.slug !== topic.slug)
        .slice(0, 8)
        .map((t) => ({ label: t.h1, path: `/recycling/${t.slug}` })),
    })
  }

  // Dedupe by path
  const seen = new Set<string>()
  return pages.filter((page) => {
    if (seen.has(page.path)) return false
    seen.add(page.path)
    return true
  })
}

let cachedCatalog: SeoPageEntry[] | null = null

export function getSeoCatalog(): SeoPageEntry[] {
  if (!cachedCatalog) cachedCatalog = buildSeoCatalog()
  return cachedCatalog
}

export function getSeoPageByPath(path: string): SeoPageEntry | undefined {
  return getSeoCatalog().find((page) => page.path === path)
}

export function getSeoPaths(): string[] {
  return getSeoCatalog().map((page) => page.path)
}

export function absoluteSeoUrl(path: string) {
  return `${SITE}${path === '/' ? '/' : path}`
}
