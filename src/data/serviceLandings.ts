import { BOOKING_ROUTE, ACCESSORIES_ROUTE } from '@/data/content'
import { localCoverage } from '@/data/localCoverage'
import type { PageSeoConfig } from '@/data/seo'
import { localBusinessJsonLd, repairServiceJsonLd } from '@/data/seo'

export type ServiceLandingBlock = {
  icon: string
  title: string
  description: string
}

export type ServiceLandingFaq = {
  question: string
  answer: string
}

export type ServiceLandingPage = {
  slug: 'phone-repair' | 'computer-repair' | 'console-repair'
  path: string
  icon: string
  heroEyebrow: string
  heroTitle: string
  heroAccent: string
  heroSubtitle: string
  intro: string[]
  services: ServiceLandingBlock[]
  whyUs: string[]
  faqs: ServiceLandingFaq[]
  ctaTitle: string
  ctaText: string
  seo: PageSeoConfig
}

export const PHONE_REPAIR_ROUTE = '/phone-repair'
export const COMPUTER_REPAIR_ROUTE = '/computer-repair'
export const CONSOLE_REPAIR_ROUTE = '/console-repair'

const areaLine = `Serving ${localCoverage.neighborhoods.slice(0, 6).join(', ')} and nearby postcodes including ${localCoverage.postcodes.join(', ')}.`

function buildSeo(opts: {
  title: string
  description: string
  path: string
  keywords: string
  serviceName: string
}): PageSeoConfig {
  return {
    title: opts.title,
    description: opts.description,
    path: opts.path,
    keywords: opts.keywords,
    image: '/images/repair-banner.png',
    jsonLd: [
      localBusinessJsonLd(),
      repairServiceJsonLd({
        name: opts.serviceName,
        serviceType: opts.serviceName,
        description: opts.description,
        path: opts.path,
      }),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://securefix.uk/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: opts.serviceName,
            item: `https://securefix.uk${opts.path}`,
          },
        ],
      },
    ],
  }
}

export const serviceLandingPages: ServiceLandingPage[] = [
  {
    slug: 'phone-repair',
    path: PHONE_REPAIR_ROUTE,
    icon: '📱',
    heroEyebrow: 'EC1V · Old Street · City Road',
    heroTitle: 'Express Phone Repair',
    heroAccent: 'Old Street & EC1V',
    heroSubtitle:
      'Same-day iPhone & Samsung screen replacement, battery repairs, charging port fixes and phone accessories at 218 City Rd, London EC1V 2PN.',
    intro: [
      'SecureFix is your local phone repair shop on City Road for walk-in and same-day mobile repairs. We fix cracked screens, batteries, cameras, back glass and water damage for iPhone, Samsung, Google Pixel and Android devices.',
      `${areaLine} Drop in near Old Street, Angel or Clerkenwell — or book online for collection and return.`,
    ],
    services: [
      {
        icon: '🖼️',
        title: 'iPhone Screen Replacement',
        description: 'Cracked iPhone screens replaced the same day with quality parts and a warranty.',
      },
      {
        icon: '🔋',
        title: 'Samsung Battery Fix',
        description: 'Battery replacements that restore health and stop unexpected shutdowns.',
      },
      {
        icon: '🔌',
        title: 'Charging Port & Back Glass',
        description: 'Charging port repair, back glass replacement and camera module fixes.',
      },
      {
        icon: '🛡️',
        title: 'Phone Protection & Accessories',
        description: 'Cases, screen protectors and chargers to keep your phone safe after repair.',
      },
      {
        icon: '💧',
        title: 'Water Damage Diagnostics',
        description: 'Liquid damage assessment and recovery for phones that will not turn on.',
      },
      {
        icon: '🛒',
        title: 'Mobile Sales & Trade-In',
        description: 'Buy, sell and trade in phones with transparent condition checks.',
      },
    ],
    whyUs: [
      'Same-day phone repair in EC1V when parts are in stock',
      'iPhone and Samsung specialists near Old Street',
      'Walk-in friendly workshop at 218 City Rd',
      'Collection & return across Angel, Islington, Shoreditch and Clerkenwell',
    ],
    faqs: [
      {
        question: 'Do you offer same-day iPhone screen replacement in EC1V?',
        answer:
          'Yes. Most iPhone and Samsung screen repairs are completed the same day at our City Road workshop when parts are available.',
      },
      {
        question: 'Which areas do you cover for phone repair?',
        answer: `We serve EC1V, Old Street, Angel, Clerkenwell, Islington, Shoreditch, Farringdon, Hoxton, Barbican, Borough and the City of London, plus postcodes ${localCoverage.postcodes.join(', ')}.`,
      },
    ],
    ctaTitle: 'Need Express Phone Repair?',
    ctaText: 'Book online or walk into SecureFix at 218 City Rd for same-day diagnostics.',
    seo: buildSeo({
      title: 'Express iPhone & Samsung Phone Repair Old Street | SecureFix',
      description:
        'Same-day screen replacement, battery repairs, and phone accessories in City Road, EC1V. Serving Angel, Islington, and Clerkenwell.',
      path: PHONE_REPAIR_ROUTE,
      keywords:
        'iPhone screen replacement, Samsung battery fix, phone protection, EC1V phone repair, phone repair Old Street, Angel phone repair, Clerkenwell phone repair',
      serviceName: 'Mobile Phone Repair',
    }),
  },
  {
    slug: 'computer-repair',
    path: COMPUTER_REPAIR_ROUTE,
    icon: '💻',
    heroEyebrow: 'Laptop · Mac · PC · Business IT',
    heroTitle: 'Laptop, Mac & PC Repair',
    heroAccent: 'London EC1V',
    heroSubtitle:
      'Professional computer repair, MacBook liquid damage fixes, SSD upgrades and laptop battery repair near Old Street & Farringdon at 218 City Rd.',
    intro: [
      'From slow PCs to MacBook liquid damage, SecureFix repairs and upgrades laptops and desktops for homes and EC1 businesses. We handle screens, batteries, keyboards, SSD upgrades, virus removal and data recovery.',
      `${areaLine} Ideal if you work near Farringdon, Barbican or the City and need reliable local PC repair.`,
    ],
    services: [
      {
        icon: '💧',
        title: 'MacBook Liquid Damage Fix',
        description: 'Careful diagnostics and board-level recovery for liquid spills.',
      },
      {
        icon: '⚡',
        title: 'PC SSD Upgrades',
        description: 'Fast SSD upgrades and cloning to speed up lagging Windows PCs and laptops.',
      },
      {
        icon: '🔋',
        title: 'Laptop Battery Repair',
        description: 'Battery replacement for Dell, HP, Lenovo, ASUS and Apple MacBook models.',
      },
      {
        icon: '🖥️',
        title: 'Screen & Keyboard Repair',
        description: 'Laptop screen replacement, hinge repair and keyboard fixes.',
      },
      {
        icon: '🛡️',
        title: 'Virus Removal & Cleanup',
        description: 'Malware removal, performance optimisation and security setup.',
      },
      {
        icon: '🏢',
        title: 'EC1 Business IT Repair',
        description: 'Staff laptop repair, call-outs and fleet support for local businesses.',
      },
    ],
    whyUs: [
      'Mac and Windows specialists in one City Road workshop',
      'SSD upgrades and same-day diagnostics where possible',
      'Business IT repair for EC1 offices near Old Street',
      'Data-safe repairs with clear handover notes',
    ],
    faqs: [
      {
        question: 'Can you upgrade my laptop SSD near Old Street?',
        answer:
          'Yes. We supply and fit SSD upgrades, clone your drive and return a faster laptop — often the same day.',
      },
      {
        question: 'Do you repair MacBooks with liquid damage?',
        answer:
          'We diagnose liquid damage carefully, recover data where possible, and repair or replace affected parts at our EC1V workshop.',
      },
    ],
    ctaTitle: 'Need Laptop or PC Repair?',
    ctaText: 'Book a repair or visit SecureFix at 218 City Rd for professional computer diagnostics.',
    seo: buildSeo({
      title: 'Laptop, Mac & PC Repair London EC1V | SecureFix',
      description:
        'Professional computer repair, SSD upgrades, and liquid damage recovery near Old Street & Farringdon. Visit 218 City Rd.',
      path: COMPUTER_REPAIR_ROUTE,
      keywords:
        'MacBook liquid damage fix, PC SSD upgrades, laptop battery repair London, EC1 business IT repair, computer repair EC1V, laptop repair Old Street, Farringdon PC repair',
      serviceName: 'Computer & Laptop Repair',
    }),
  },
  {
    slug: 'console-repair',
    path: CONSOLE_REPAIR_ROUTE,
    icon: '🎮',
    heroEyebrow: 'PS5 · Xbox · Nintendo Switch',
    heroTitle: 'Console Repair',
    heroAccent: 'London',
    heroSubtitle:
      'Express PS5 HDMI port replacement, Xbox fan cleaning, Nintendo Switch screen fixes and gaming console maintenance at 218 City Rd, EC1V 2PN.',
    intro: [
      'SecureFix is a local console repair shop for PlayStation, Xbox and Nintendo Switch. We fix HDMI ports, overheating, disc drives, power faults and DualSense stick drift with fast walk-in service.',
      `${areaLine} Bring your console to City Road or book collection across nearby London postcodes.`,
    ],
    services: [
      {
        icon: '📺',
        title: 'PS5 HDMI Port Replacement',
        description: 'No-picture PS5 HDMI port repair and socket replacement by experienced technicians.',
      },
      {
        icon: '🌀',
        title: 'Xbox Fan Cleaning',
        description: 'Deep clean and thermal service to stop loud fans and overheating shutdowns.',
      },
      {
        icon: '🕹️',
        title: 'Nintendo Switch Screen Fix',
        description: 'Switch screen replacement, charging issues and Joy-Con drift repairs.',
      },
      {
        icon: '🎧',
        title: 'DualSense Stick Drift',
        description: 'PS5 controller stick drift fixes so gameplay feels precise again.',
      },
      {
        icon: '💿',
        title: 'Disc Drive & Power Repair',
        description: 'Disc drive faults, power supply issues and blue-light diagnostics.',
      },
      {
        icon: '⚡',
        title: 'Fast Walk-In Console Service',
        description: 'Express diagnostics and repair booking at our EC1V workshop.',
      },
    ],
    whyUs: [
      'PS5 HDMI specialists in London EC1V',
      'Xbox, Switch and PlayStation under one roof',
      'Fast walk-in diagnostics on City Road',
      'Controller drift and cooling repairs included',
    ],
    faqs: [
      {
        question: 'How much does PS5 HDMI port repair cost?',
        answer:
          'Pricing depends on the fault and parts needed. Bring your console to 218 City Rd for a clear same-day quote, or book online and we will confirm details.',
      },
      {
        question: 'Do you repair Nintendo Switch screens?',
        answer:
          'Yes. We replace cracked Switch screens and also fix charging ports and Joy-Con drift.',
      },
    ],
    ctaTitle: 'Need Console Repair Today?',
    ctaText: 'Walk in or book online for PS5, Xbox and Switch repairs at SecureFix London.',
    seo: buildSeo({
      title: 'PlayStation, Xbox & Switch Repair London | SecureFix',
      description:
        'Express PS5 HDMI port fix, Xbox repair, and gaming console maintenance at 218 City Rd, EC1V 2PN. Fast walk-in service.',
      path: CONSOLE_REPAIR_ROUTE,
      keywords:
        'PS5 HDMI port replacement, Xbox fan cleaning, Nintendo Switch screen fix, console repair London, PS5 repair EC1V, Xbox repair Old Street',
      serviceName: 'PlayStation & Console Repair',
    }),
  },
]

export function getServiceLanding(slug: string): ServiceLandingPage | undefined {
  return serviceLandingPages.find((page) => page.slug === slug)
}

export const serviceLandingLinks = [
  { label: 'Phone Repair', route: PHONE_REPAIR_ROUTE },
  { label: 'Computer Repair', route: COMPUTER_REPAIR_ROUTE },
  { label: 'Console Repair', route: CONSOLE_REPAIR_ROUTE },
  { label: 'Book Repair', route: BOOKING_ROUTE },
  { label: 'Accessories', route: ACCESSORIES_ROUTE },
]
