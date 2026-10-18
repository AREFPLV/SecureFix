import {
  site,
  BOOKING_ROUTE,
  LIFECYCLE_ROUTE,
  RECYCLING_ROUTE,
  TRADE_IN_ROUTE,
  ACCESSORIES_ROUTE,
  ABOUT_ROUTE,
} from '@/data/content'

const SITE_ORIGIN = `https://${site.website}`

export type PageSeoConfig = {
  title: string
  description: string
  path: string
  keywords?: string
  image?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

type ServiceOffer = { name: string; description: string }

function offer(name: string, description: string) {
  return {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name,
      description,
      provider: { '@id': `${SITE_ORIGIN}/#business` },
      areaServed: { '@type': 'City', name: 'London' },
    },
  }
}

function catalog(name: string, services: ServiceOffer[]) {
  return {
    '@type': 'OfferCatalog',
    name,
    itemListElement: services.map((s) => offer(s.name, s.description)),
  }
}

/** Phone repair services mapped from high-intent local search terms. */
export const phoneRepairServices: ServiceOffer[] = [
  { name: 'Phone Repair', description: 'Mobile and cell phone repair shop in London for iPhone, Samsung, Google Pixel and Android devices.' },
  { name: 'iPhone Screen Replacement', description: 'Cracked iPhone screen repair and screen replacement with same-day service in London.' },
  { name: 'Samsung Screen Replacement', description: 'Samsung phone screen replacement and cracked screen repair.' },
  { name: 'Phone Screen Repair', description: 'Phone screen replacement and cracked screen repair for all major brands.' },
  { name: 'iPhone Battery Replacement', description: 'iPhone battery replacement to restore battery health and charging performance.' },
  { name: 'Phone Battery Replacement', description: 'Phone battery replacement for iPhone, Samsung, Pixel and Android phones.' },
  { name: 'iPhone Charging Port Repair', description: 'iPhone charging port repair when your phone will not charge reliably.' },
  { name: 'iPhone Back Glass Repair', description: 'iPhone back glass repair and rear glass replacement.' },
  { name: 'Phone Camera Replacement', description: 'Phone camera replacement and camera repair for blurry or broken lenses.' },
  { name: 'Phone Water Damage Repair', description: 'Phone water damage repair and diagnostics after liquid spills.' },
  { name: 'Same Day Phone Repair', description: 'Same day phone repair in London for screens, batteries and common faults.' },
  { name: 'Google Pixel Repair', description: 'Google Pixel repair including screen, battery and charging issues.' },
  { name: 'Android Phone Repair', description: 'Android phone repair for Samsung, Pixel and other Android brands.' },
  { name: 'iPad Repair', description: 'iPad repair near you in London — screen, battery and charging port fixes.' },
  { name: 'Phone Power Fault Repair', description: 'Repair for phones that will not turn on, including power and board diagnostics.' },
]

/** Laptop and computer repair services mapped from high-intent local search terms. */
export const computerRepairServices: ServiceOffer[] = [
  { name: 'Computer Repair', description: 'Computer and PC repair shop in London for desktops and laptops.' },
  { name: 'Laptop Repair', description: 'Laptop repair for Dell, HP, Lenovo, ASUS, Apple MacBook and more.' },
  { name: 'PC Repair', description: 'PC repair services including diagnostics, hardware fixes and upgrades.' },
  { name: 'MacBook Repair', description: 'MacBook and Apple computer repair including screen, battery and logic board work.' },
  { name: 'MacBook Screen Repair', description: 'MacBook screen repair and laptop screen replacement.' },
  { name: 'Laptop Screen Replacement', description: 'Laptop screen replacement and cracked display repair.' },
  { name: 'Laptop Battery Replacement', description: 'Laptop battery replacement to fix short runtime and swelling batteries.' },
  { name: 'Laptop Keyboard Repair', description: 'Laptop keyboard repair and key replacement.' },
  { name: 'Laptop Charging Port Repair', description: 'Laptop charging port repair when the device will not charge.' },
  { name: 'Laptop Hinge Repair', description: 'Laptop hinges repair for loose, broken or misaligned lids.' },
  { name: 'Laptop Water Damage Repair', description: 'Laptop liquid damage repair and cleanup.' },
  { name: 'Gaming PC Repair', description: 'Gaming PC repair for overheating, no power, GPU and performance issues.' },
  { name: 'Desktop Computer Repair', description: 'Desktop computer repair, diagnostics and hardware replacement.' },
  { name: 'iMac Repair', description: 'iMac repair including screen, storage and power issues.' },
  { name: 'Dell Laptop Repair', description: 'Dell laptop repair for screens, keyboards, batteries and ports.' },
  { name: 'HP Laptop Repair', description: 'HP laptop repair for common hardware and performance faults.' },
  { name: 'Lenovo Laptop Repair', description: 'Lenovo laptop repair including ThinkPad and consumer models.' },
  { name: 'ASUS Laptop Repair', description: 'ASUS laptop repair for screens, charging and overheating.' },
  { name: 'Virus Removal', description: 'Virus and malware removal service to clean and secure slow computers.' },
  { name: 'Data Recovery', description: 'Data recovery service for failed hard drives and inaccessible devices.' },
  { name: 'Hard Drive Repair & Upgrade', description: 'Computer hard drive repair, SSD upgrades and storage diagnostics.' },
  { name: 'Computer Diagnostics', description: 'Computer diagnostic service to find hardware and software faults.' },
  { name: 'Slow Computer Repair', description: 'Fix slow computers with cleanup, upgrades and optimisation.' },
  { name: 'Laptop Overheating Repair', description: 'Laptop overheating fix including cleaning and thermal paste service.' },
  { name: 'At-Home Computer Repair Call-Out', description: 'At-home and on-site computer technician call-out across London.' },
  { name: 'Computer Cleaning Service', description: 'Computer cleaning service to remove dust and improve cooling.' },
  { name: 'Custom PC Repair', description: 'Custom PC repair and troubleshooting for builds and upgrades.' },
  { name: 'Emergency Computer Repair', description: 'Fast and emergency computer repair for urgent business and home needs.' },
]

/** PS5 and gaming console repair services mapped from high-intent local search terms. */
export const consoleRepairServices: ServiceOffer[] = [
  { name: 'PS5 Repair', description: 'PS5 repair shop in London for HDMI, power, disc drive and overheating faults.' },
  { name: 'PS5 HDMI Port Repair', description: 'PS5 HDMI port repair and fix when there is no display signal.' },
  { name: 'PS5 Controller Repair', description: 'PS5 DualSense controller repair including stick drift fixes.' },
  { name: 'DualSense Stick Drift Repair', description: 'Fix PS5 controller drift and DualSense analogue stick issues.' },
  { name: 'PS5 Overheating Repair', description: 'PS5 overheating fix and loud fan repair with cleaning and thermal service.' },
  { name: 'PS5 Power Issues Repair', description: 'PS5 will not turn on, turns off by itself, or needs power supply replacement.' },
  { name: 'PS5 Disc Drive Repair', description: 'PS5 disc drive repair when games will not read or eject.' },
  { name: 'PS5 Blue Light of Death Repair', description: 'PS5 blue light of death diagnostics and motherboard-level repair where possible.' },
  { name: 'PS5 Motherboard Repair', description: 'PS5 motherboard repair and advanced board-level diagnostics.' },
  { name: 'PlayStation Repair', description: 'PlayStation repair centre for PS5 and PS4 consoles.' },
  { name: 'PS4 Repair', description: 'PS4 repair for HDMI, disc drive and power faults.' },
  { name: 'Xbox Repair', description: 'Xbox repair including HDMI port and power issues.' },
  { name: 'Xbox HDMI Port Repair', description: 'Xbox HDMI port repair when the console has no picture.' },
  { name: 'Nintendo Switch Repair', description: 'Nintendo Switch repair including screen and charging faults.' },
  { name: 'Nintendo Switch Screen Repair', description: 'Nintendo Switch screen repair and display replacement.' },
  { name: 'Game Console Repair', description: 'Local console repair shop for PlayStation, Xbox and Nintendo Switch.' },
]

/** High-intent keywords for meta tags (London-focused; no competitor brand spam). */
export const repairSeoKeywords = [
  // Phone
  'phone repair near me',
  'cell phone repair',
  'cracked screen repair',
  'iPhone screen replacement',
  'iPhone repair shop near me',
  'Samsung phone repair',
  'phone screen replacement',
  'phone battery replacement near me',
  'same day phone repair',
  'cheap phone repair near me',
  'fix my phone screen',
  'iPhone battery replacement',
  'mobile phone repair shop near me',
  'iPhone charging port repair',
  'back glass repair iPhone',
  'Samsung screen replacement',
  'phone water damage repair near me',
  'Google Pixel repair near me',
  'mobile repair shop near me',
  'phone camera replacement',
  'phone screen repair cost',
  'iPad repair near me',
  'Android phone repair near me',
  // Computer
  'computer repair near me',
  'pc repair near me',
  'laptop repair near me',
  'laptop screen replacement',
  'computer repair shop near me',
  'fix laptop screen near me',
  'Mac repair near me',
  'MacBook screen repair',
  'PC repair shop near me',
  'Dell laptop repair near me',
  'HP laptop repair near me',
  'computer repair services near me',
  'laptop battery replacement near me',
  'laptop keyboard repair',
  'gaming PC repair near me',
  'Apple computer repair near me',
  'Lenovo laptop repair near me',
  'laptop charging port repair',
  'computer technician near me',
  'local PC repair',
  'desktop computer repair near me',
  'laptop water damage repair',
  'PC repair shop',
  'fix my computer near me',
  'MacBook battery replacement',
  'laptop hinges repair near me',
  'virus removal service near me',
  'data recovery service near me',
  'iMac repair near me',
  'ASUS laptop repair near me',
  'custom PC repair near me',
  'computer diagnostic near me',
  'cheap computer repair near me',
  'emergency computer repair',
  'at home computer repair near me',
  'computer cleaning service near me',
  'fix slow computer',
  'laptop overheating fix',
  'computer repair technician near me',
  'places that fix laptops near me',
  // Console
  'PS5 repair near me',
  'PS5 repair shop near me',
  'PS5 HDMI port repair near me',
  'PS5 HDMI port repair cost',
  'PS5 HDMI port fix',
  'PS5 controller repair near me',
  'PS5 stick drift fix',
  'DualSense controller repair',
  'PS5 overheating fix',
  'PS5 turning off by itself fix',
  'PS5 loud fan fix',
  'PlayStation repair center near me',
  'console repair shop near me',
  'PS5 power supply replacement',
  'PS5 disc drive repair',
  'PS5 blue light of death fix',
  'PS5 will not turn on repair',
  'game console repair near me',
  'Xbox repair near me',
  'Nintendo Switch repair near me',
  'Nintendo Switch screen repair',
  'Xbox HDMI port repair',
  'PS4 repair near me',
  'PS5 repair cost',
  'fix PS5 controller drift',
  'PS5 motherboard repair',
  'local console repair shop',
  // Brand + city
  'SecureFix London',
  'phone repair London',
  'laptop repair London',
  'PS5 repair London',
].join(', ')

export function repairOfferCatalogJsonLd() {
  return {
    '@type': 'OfferCatalog',
    name: 'SecureFix phone, computer and console repair services',
    itemListElement: [
      catalog('Phone & tablet repair', phoneRepairServices),
      catalog('Laptop & computer repair', computerRepairServices),
      catalog('PS5 & gaming console repair', consoleRepairServices),
    ],
  }
}

/** Shared LocalBusiness details Google uses for local repair searches. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['ElectronicsStore', 'LocalBusiness'],
    '@id': `${SITE_ORIGIN}/#business`,
    name: site.name,
    alternateName: ['SecureFix London', 'SecureFix Phone & Computer Repair'],
    description:
      'SecureFix is a London phone repair, computer repair and PS5 / PlayStation repair shop. Same-day cracked screen repair, iPhone & Samsung screen replacement, laptop repair, MacBook repair, virus removal, data recovery, DualSense stick drift fixes and HDMI port repair. Collection & return and on-site call-out across London.',
    url: SITE_ORIGIN,
    telephone: '+442033367147',
    email: site.email,
    image: `${SITE_ORIGIN}/logo.png`,
    logo: `${SITE_ORIGIN}/logo.png`,
    priceRange: '££',
    currenciesAccepted: 'GBP',
    paymentAccepted: 'Cash, Credit Card, Debit Card (in store)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '218 City Rd',
      addressLocality: 'London',
      addressRegion: 'England',
      postalCode: 'EC1V 2PN',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.5284,
      longitude: -0.0881,
    },
    areaServed: [
      { '@type': 'City', name: 'London' },
      { '@type': 'AdministrativeArea', name: 'Greater London' },
      'EC1V',
      'EC1M',
      'EC1R',
      'EC1Y',
      'N1',
      'EC2A',
      'SE1',
      'E2',
      'E8',
      'Old Street',
      'Angel',
      'Clerkenwell',
      'Islington',
      'Shoreditch',
      'Farringdon',
      'Hoxton',
      'Barbican',
      'Borough',
      'City of London',
    ],
    legalName: 'SECUREFIX LTD',
    openingHours: 'Monday to Saturday 09:00-19:00. Closed Sunday.',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '00:00',
        closes: '00:00',
        description: 'Closed',
      },
    ],
    knowsAbout: [
      'Phone repair',
      'Cell phone repair',
      'Cracked screen repair',
      'iPhone screen replacement',
      'Samsung phone repair',
      'Phone battery replacement',
      'iPhone charging port repair',
      'Phone water damage repair',
      'Google Pixel repair',
      'iPad repair',
      'Computer repair',
      'PC repair',
      'Laptop repair',
      'MacBook repair',
      'Laptop screen replacement',
      'Virus removal',
      'Data recovery',
      'PS5 repair',
      'PS5 HDMI port repair',
      'PS5 controller stick drift repair',
      'Xbox repair',
      'Nintendo Switch repair',
      'Game console repair',
    ],
    sameAs: [
      'https://www.facebook.com/share/1F5oTbbWUE/?mibextid=wwXIfr',
      'https://www.instagram.com/securefix_london',
      'https://www.tiktok.com/@securefixlondon',
    ],
    hasOfferCatalog: repairOfferCatalogJsonLd(),
    makesOffer: [
      ...phoneRepairServices.slice(0, 8),
      ...computerRepairServices.slice(0, 8),
      ...consoleRepairServices.slice(0, 8),
    ].map((s) => offer(s.name, s.description)),
  }
}

export function repairServiceJsonLd(opts: {
  name: string
  description: string
  path: string
  serviceType: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: `${SITE_ORIGIN}${opts.path}`,
    provider: { '@id': `${SITE_ORIGIN}/#business` },
    areaServed: {
      '@type': 'City',
      name: 'London',
    },
  }
}

export const homeSeo: PageSeoConfig = {
  title: 'Mobile Phone, Computer & Console Repair EC1V | SecureFix London',
  description:
    'Same-day phone, PC, and PlayStation repair shop at 218 City Rd, London EC1V 2PN. Fast diagnostics, screen fixes, and accessories.',
  path: '/',
  keywords: repairSeoKeywords,
  image: '/images/hero-banner.png',
  jsonLd: localBusinessJsonLd(),
}

export const bookRepairSeo: PageSeoConfig = {
  title: 'Book Phone, Laptop or PS5 Repair Online | SecureFix London',
  description:
    'Book phone repair, laptop repair or PS5 repair online. Screen replacement, battery replacement, HDMI port repair, stick drift fix and more. Mail-in, drop-off or London collection.',
  path: BOOKING_ROUTE,
  keywords: repairSeoKeywords,
  image: '/images/repair-banner.png',
  jsonLd: [
    localBusinessJsonLd(),
    repairServiceJsonLd({
      name: 'Book Phone, Computer & Console Repair',
      serviceType: 'Phone repair, computer repair, laptop repair, PS5 repair',
      description:
        'Online booking for phone screen repair, computer repair, MacBook repair, PS5 HDMI repair and console fixes in London.',
      path: BOOKING_ROUTE,
    }),
  ],
}

export const aboutSeo: PageSeoConfig = {
  title: 'About SecureFix | London Phone, Laptop & PS5 Repair Shop',
  description:
    'SecureFix London — specialists in phone repair, computer repair and PlayStation / PS5 repair with same-day service and a 2-year warranty.',
  path: ABOUT_ROUTE,
  keywords: repairSeoKeywords,
  image: '/images/about-banner.png',
  jsonLd: localBusinessJsonLd(),
}

export const lifecycleSeo: PageSeoConfig = {
  title: 'Business IT & Laptop Sourcing London | SecureFix for Business',
  description:
    'SecureFix for Business — laptop sourcing, deployment, configuration and full device lifecycle management for London companies.',
  path: LIFECYCLE_ROUTE,
  keywords: 'business laptop sourcing London, business IT support, device lifecycle management',
  image: '/images/business-it-hero.png',
}

export const recyclingSeo: PageSeoConfig = {
  title: 'Phone & Laptop Recycling London | Secure Data Wipe | SecureFix',
  description:
    'Secure phone, tablet and laptop recycling in London with certified data wipe. Responsible IT asset disposal for homes and businesses.',
  path: RECYCLING_ROUTE,
  keywords: 'phone recycling London, laptop recycling, certified data wipe, IT asset disposal',
  image: '/images/recycling-hero.png',
}

export const tradeInSeo: PageSeoConfig = {
  title: 'Phone & Device Trade-In London | SecureFix',
  description: 'Trade in your phone, tablet or laptop with SecureFix London. Get a quote and arrange collection or drop-off.',
  path: TRADE_IN_ROUTE,
  keywords: 'phone trade in London, laptop trade in, sell old phone London',
}

export const accessoriesSeo: PageSeoConfig = {
  title: 'Phone & Laptop Accessories London | SecureFix',
  description: 'Cases, chargers, screen protectors and accessories for phones and laptops from SecureFix London.',
  path: ACCESSORIES_ROUTE,
  keywords: 'phone accessories London, laptop chargers, screen protectors',
}

export { SITE_ORIGIN }
