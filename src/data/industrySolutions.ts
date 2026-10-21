import { LIFECYCLE_ROUTE } from '@/data/content'

export type IndustrySolution = {
  slug: string
  label: string
  shortLabel: string
  title: string
  description: string
  h1: string
  accent: string
  keywords: string
  intro: string
  challenges: { title: string; text: string }[]
  howWeHelp: { title: string; text: string }[]
  services: string[]
  outcomes: string[]
}

export const INDUSTRY_SOLUTIONS_BASE = `${LIFECYCLE_ROUTE}/solutions`

export function industrySolutionRoute(slug: string): string {
  return `${INDUSTRY_SOLUTIONS_BASE}/${slug}`
}

export const industrySolutions: IndustrySolution[] = [
  {
    slug: 'businesses-corporate',
    label: 'Businesses & Corporate',
    shortLabel: 'Businesses & Corporate',
    title: 'Corporate & Business IT Support London | SecureFix',
    description:
      'IT support for businesses and corporate teams in London — laptop sourcing, onboarding, repair, security and lifecycle management.',
    h1: 'Businesses & Corporate',
    accent: 'IT Support',
    keywords:
      'corporate IT support London, business IT support, company laptop sourcing, SME IT support SecureFix',
    intro:
      'Growing companies need reliable devices, fast onboarding and clear support when something breaks. SecureFix helps businesses and corporate teams keep staff productive with sourcing, setup, repair and secure refresh — without adding pressure to your internal IT.',
    challenges: [
      {
        title: 'Mixed device fleets',
        text: 'Different roles need different laptops, while finance still wants consistent pricing and warranties.',
      },
      {
        title: 'Slow onboarding',
        text: 'New starters wait days for accounts, software and configured machines before they can work.',
      },
      {
        title: 'Reactive support',
        text: 'Broken screens, failing batteries and outages pull people offline with no clear repair path.',
      },
    ],
    howWeHelp: [
      {
        title: 'Role-based sourcing',
        text: 'We match Dell, HP, Lenovo, Microsoft and Apple devices to office, hybrid and executive roles.',
      },
      {
        title: 'Desk-ready deployment',
        text: 'Imaging, security, email and company apps are applied before devices reach your team.',
      },
      {
        title: 'Repair & swap cover',
        text: 'Same-day or next-day repair options and temporary replacements keep projects moving.',
      },
      {
        title: 'Secure refresh cycles',
        text: 'Old laptops are wiped and recycled when you upgrade, with clear audit trails for compliance.',
      },
    ],
    services: [
      'Business laptop procurement',
      'OS imaging & security setup',
      'On-site and workshop repair',
      'Fleet health checks',
      'Secure data wipe & recycling',
    ],
    outcomes: [
      'Faster new-starter readiness',
      'Fewer downtime days from broken devices',
      'Clearer hardware costs across teams',
      'Safer retirement of old company machines',
    ],
  },
  {
    slug: 'schools-education',
    label: 'Schools & Education',
    shortLabel: 'Schools & Education',
    title: 'School & Education IT Support London | SecureFix',
    description:
      'IT support for schools, colleges and education sites in London — classroom devices, staff laptops, repairs and secure recycling.',
    h1: 'Schools & Education',
    accent: 'IT Support',
    keywords:
      'school IT support London, education laptop repair, college device management, classroom IT SecureFix',
    intro:
      'Schools and colleges rely on shared devices, staff laptops and reliable Wi‑Fi-ready kits every term. SecureFix supports education sites with durable device choices, quick repairs during term time, and secure disposal when equipment is retired.',
    challenges: [
      {
        title: 'Heavy shared use',
        text: 'Classroom and library devices take daily wear from many users and need tough, easy-to-reset setups.',
      },
      {
        title: 'Term-time urgency',
        text: 'A failed teacher laptop or exam-room machine cannot wait weeks for a replacement.',
      },
      {
        title: 'Safeguarding & data',
        text: 'Student and staff data must be protected when devices are repaired, reused or recycled.',
      },
    ],
    howWeHelp: [
      {
        title: 'Classroom-ready kits',
        text: 'We source and image devices for staff, labs and shared student use with clear baselines.',
      },
      {
        title: 'Priority education repairs',
        text: 'Screen, battery, keyboard and charging faults are handled quickly to reduce lesson disruption.',
      },
      {
        title: 'Holiday refresh projects',
        text: 'Bulk setup, asset labelling and rollouts planned around half-term and summer windows.',
      },
      {
        title: 'Secure end-of-life',
        text: 'Retired Chromebooks, laptops and tablets are wiped and recycled to education standards.',
      },
    ],
    services: [
      'Staff & classroom device sourcing',
      'Imaging and account readiness',
      'On-site call-outs for urgent faults',
      'Battery and screen repair programmes',
      'WEEE-compliant education recycling',
    ],
    outcomes: [
      'Less lesson downtime',
      'Predictable device budgets across terms',
      'Safer handling of pupil and staff data',
      'Cleaner audit trail for retired kit',
    ],
  },
  {
    slug: 'cafes-restaurants',
    label: 'Cafés & Restaurants',
    shortLabel: 'Cafés & Restaurants',
    title: 'Café & Restaurant IT Support London | SecureFix',
    description:
      'IT support for cafés and restaurants in London — POS tablets, kitchen displays, staff devices, repairs and on-site help.',
    h1: 'Cafés & Restaurants',
    accent: 'IT Support',
    keywords:
      'restaurant IT support London, café POS tablet repair, hospitality device support, kitchen display repair',
    intro:
      'Hospitality venues depend on tills, tablets, printers and kitchen displays at peak hours. SecureFix keeps café and restaurant tech running with fast repairs, spare-device options and practical setups that match busy service environments.',
    challenges: [
      {
        title: 'Peak-time downtime',
        text: 'A dead POS tablet or receipt printer during lunch service hits sales immediately.',
      },
      {
        title: 'Spill and heat damage',
        text: 'Kitchen and bar areas expose devices to liquid, grease and temperature stress.',
      },
      {
        title: 'Multi-site consistency',
        text: 'Groups need the same apps, printers and Wi‑Fi behaviour across every branch.',
      },
    ],
    howWeHelp: [
      {
        title: 'Hospitality device setup',
        text: 'Tablets, POS handsets and back-office laptops configured for your ordering and payments stack.',
      },
      {
        title: 'Fast fault response',
        text: 'Call-out or collect-and-return repair for screens, batteries, charging docks and ports.',
      },
      {
        title: 'Spare unit planning',
        text: 'We help you keep a small hot-swap pool so service continues while a device is repaired.',
      },
      {
        title: 'Branch rollouts',
        text: 'New sites get labelled, tested devices ready for staff training day.',
      },
    ],
    services: [
      'POS tablet & laptop repair',
      'On-site call-out support',
      'Device sourcing for new openings',
      'Printer and accessory supply',
      'Secure wipe of retired staff devices',
    ],
    outcomes: [
      'Fewer lost covers from till failures',
      'Faster recovery during busy service',
      'Standard setups across branches',
      'Lower panic buying of replacement kit',
    ],
  },
  {
    slug: 'construction-sites',
    label: 'Construction Sites',
    shortLabel: 'Construction Sites',
    title: 'Construction Site IT Support London | SecureFix',
    description:
      'IT support for construction sites and site offices in London — rugged-ready laptops, tablets, repairs and field device support.',
    h1: 'Construction Sites',
    accent: 'IT Support',
    keywords:
      'construction site IT support London, site office laptop repair, field tablet support, contractor IT SecureFix',
    intro:
      'Site managers, QS teams and supervisors need devices that survive vans, cabins and dusty environments. SecureFix supports construction firms with practical hardware choices, quick repairs and replacements that keep drawings, emails and site apps available on location.',
    challenges: [
      {
        title: 'Harsh conditions',
        text: 'Dust, drops and long days outdoors shorten the life of standard office laptops.',
      },
      {
        title: 'Mobile workforce',
        text: 'Staff move between sites and need reliable batteries, charging and remote-ready setups.',
      },
      {
        title: 'Project deadlines',
        text: 'A failed site laptop can delay snagging lists, inductions and client reporting.',
      },
    ],
    howWeHelp: [
      {
        title: 'Field-ready sourcing',
        text: 'We recommend durable laptops and tablets suited to site offices and mobile supervisors.',
      },
      {
        title: 'Rapid repair & loan units',
        text: 'Broken screens and charging faults are turned around quickly, with loan options when needed.',
      },
      {
        title: 'Site office setups',
        text: 'Cabin PCs, docks and peripherals configured so teams can print, scan and sync on arrival.',
      },
      {
        title: 'Project close-out recycling',
        text: 'When a project ends, devices are collected, wiped and recycled or redeployed.',
      },
    ],
    services: [
      'Rugged-ready laptop & tablet supply',
      'Site call-outs across London',
      'Battery and screen repair',
      'Docking and peripheral kits',
      'Secure project asset retirement',
    ],
    outcomes: [
      'Less downtime on active sites',
      'Devices matched to field roles',
      'Clearer control of site IT assets',
      'Safer handling of project data at close-out',
    ],
  },
  {
    slug: 'law-firms-solicitors',
    label: 'Law Firms & Solicitors',
    shortLabel: 'Law Firms & Solicitors',
    title: 'Law Firm & Solicitor IT Support London | SecureFix',
    description:
      'IT support for law firms and solicitors in London — secure laptops, encryption, confidential repair and compliant device disposal.',
    h1: 'Law Firms & Solicitors',
    accent: 'IT Support',
    keywords:
      'law firm IT support London, solicitor laptop repair, legal practice IT, confidential data wipe SecureFix',
    intro:
      'Legal practices need confidentiality, continuity and devices that support long documents, video hearings and secure email. SecureFix helps law firms and solicitors with trusted hardware, encrypted setup, discreet repair handling and certified disposal of retired machines.',
    challenges: [
      {
        title: 'Client confidentiality',
        text: 'Case files and client data must stay protected during repair, reuse and recycling.',
      },
      {
        title: 'Partner productivity',
        text: 'Fee-earners cannot lose billable hours to slow or broken laptops.',
      },
      {
        title: 'Compliance pressure',
        text: 'Firms need clear evidence that retired devices were wiped before leaving the business.',
      },
    ],
    howWeHelp: [
      {
        title: 'Secure-by-default setup',
        text: 'BitLocker, strong accounts, managed antivirus and VPN-ready builds for fee-earners and support staff.',
      },
      {
        title: 'Discreet repair handling',
        text: 'Devices are processed with confidentiality in mind — no casual browsing of client material.',
      },
      {
        title: 'Partner & paralegal kits',
        text: 'Sourcing matched to document-heavy workloads, dual monitors and hybrid hearings.',
      },
      {
        title: 'Certified retirement',
        text: 'Hard drives and devices wiped or destroyed with documentation suitable for practice audits.',
      },
    ],
    services: [
      'Encrypted laptop deployment',
      'Confidential repair service',
      'Matter-ready workstation sourcing',
      'Certificate of destruction options',
      'Office IT call-out support',
    ],
    outcomes: [
      'Stronger control of client data',
      'Fewer billable-hour interruptions',
      'Audit-friendly device retirement',
      'Consistent builds across the practice',
    ],
  },
  {
    slug: 'care-homes',
    label: 'Care Homes',
    shortLabel: 'Care Homes',
    title: 'Care Home IT Support London | SecureFix',
    description:
      'IT support for care homes in London — staff devices, nurse-station PCs, secure setup, repairs and resident-data-safe recycling.',
    h1: 'Care Homes',
    accent: 'IT Support',
    keywords:
      'care home IT support London, nursing home computer repair, care staff laptop support, SecureFix care sector IT',
    intro:
      'Care homes need dependable systems for care records, medication rounds, family calls and staff rotas. SecureFix supports care providers with practical devices, fast repairs and secure handling of equipment that may hold sensitive resident information.',
    challenges: [
      {
        title: 'Always-on care records',
        text: 'Staff need working terminals and tablets across shifts, not just office hours.',
      },
      {
        title: 'Sensitive resident data',
        text: 'Health and personal information must stay protected when devices fail or are replaced.',
      },
      {
        title: 'Mixed tech confidence',
        text: 'Teams need simple, reliable kit that just works during busy medication and handover windows.',
      },
    ],
    howWeHelp: [
      {
        title: 'Care-floor ready devices',
        text: 'Laptops and tablets set up for care planning software, email and secure Wi‑Fi access.',
      },
      {
        title: 'Shift-friendly support',
        text: 'Repair and call-out options that minimise disruption for day and night teams.',
      },
      {
        title: 'Simple staff builds',
        text: 'Clear accounts and essentials-only setups so agency and permanent staff can log in quickly.',
      },
      {
        title: 'Safe decommissioning',
        text: 'Retired nurse-station PCs and tablets are wiped before recycling or redeployment.',
      },
    ],
    services: [
      'Staff device sourcing & setup',
      'Nurse-station PC repair',
      'On-site support visits',
      'Secure data wipe',
      'Accessory and charging kits',
    ],
    outcomes: [
      'More reliable care-record access',
      'Less downtime on shared terminals',
      'Safer handling of resident data',
      'Easier onboarding for new staff devices',
    ],
  },
  {
    slug: 'hotels-hostels',
    label: 'Hotels & Hostels',
    shortLabel: 'Hotels & Hostels',
    title: 'Hotel & Hostel IT Support London | SecureFix',
    description:
      'IT support for hotels and hostels in London — front-desk PCs, staff devices, guest-facing tablets, repairs and multi-site setup.',
    h1: 'Hotels & Hostels',
    accent: 'IT Support',
    keywords:
      'hotel IT support London, hostel computer repair, front desk PC support, hospitality IT SecureFix',
    intro:
      'Hotels and hostels run on front-desk systems, housekeeping devices and back-office PCs that cannot fail at check-in. SecureFix helps hospitality operators keep that kit reliable with sourcing, setup, repair and refresh support across one or many properties.',
    challenges: [
      {
        title: '24/7 operations',
        text: 'Reception and night teams need working systems around the clock.',
      },
      {
        title: 'Guest experience risk',
        text: 'Slow check-in or failed key-card linked PCs damages reviews quickly.',
      },
      {
        title: 'Staff turnover',
        text: 'Devices must be easy to reset and redeploy as teams change.',
      },
    ],
    howWeHelp: [
      {
        title: 'Front-of-house readiness',
        text: 'Reception PCs and tablets configured for PMS, payments and printing workflows.',
      },
      {
        title: 'Rapid hospitality repairs',
        text: 'Priority fixes for check-in machines, staff laptops and back-office units.',
      },
      {
        title: 'Property rollout support',
        text: 'New openings and refurbishments get labelled, tested device packs.',
      },
      {
        title: 'Secure staff offboarding',
        text: 'Leavers’ devices wiped before reuse across the group.',
      },
    ],
    services: [
      'Front-desk & back-office device support',
      'Staff laptop sourcing',
      'On-site call-outs',
      'Multi-property standard builds',
      'Secure recycling of retired kit',
    ],
    outcomes: [
      'Smoother check-in technology',
      'Faster recovery from hardware faults',
      'Consistent setups across properties',
      'Cleaner control of staff devices',
    ],
  },
  {
    slug: 'airports',
    label: 'Airports',
    shortLabel: 'Airports',
    title: 'Airport IT Support London | SecureFix',
    description:
      'IT support for airport teams and operators in London — staff devices, ops laptops, secure repair and rapid replacement cover.',
    h1: 'Airports',
    accent: 'IT Support',
    keywords:
      'airport IT support London, airport staff laptop repair, aviation ops device support, SecureFix airport IT',
    intro:
      'Airport operations run on tight timelines. Ground teams, retailers and support units need devices that stay online through long shifts. SecureFix provides sourcing, secure configuration, fast repair and replacement options suited to airport and airside-adjacent workplaces.',
    challenges: [
      {
        title: 'Time-critical ops',
        text: 'A failed device during turnaround or shift handover has an immediate operational cost.',
      },
      {
        title: 'Access & security',
        text: 'Devices often hold shift, logistics or commercial data that must stay controlled.',
      },
      {
        title: 'Long operating hours',
        text: 'Support windows need to match early starts, late finishes and rotating teams.',
      },
    ],
    howWeHelp: [
      {
        title: 'Ops-ready builds',
        text: 'Laptops and tablets prepared with the apps, accounts and security your airport teams need.',
      },
      {
        title: 'Rapid swap pathways',
        text: 'Repair plus replacement planning so shifts are not blocked by a single failed unit.',
      },
      {
        title: 'Secure handling',
        text: 'Confidential processing and certified wipe options for retired operational devices.',
      },
      {
        title: 'Fleet visibility',
        text: 'Asset labelling and refresh planning for large, distributed teams.',
      },
    ],
    services: [
      'Staff device procurement',
      'Secure configuration',
      'Priority repair & call-out',
      'Hot-swap / loan device planning',
      'Certified data destruction',
    ],
    outcomes: [
      'Less operational downtime',
      'Stronger device security posture',
      'Clearer fleet refresh planning',
      'Faster recovery during peak schedules',
    ],
  },
  {
    slug: 'offices',
    label: 'Offices',
    shortLabel: 'Offices',
    title: 'Office IT Support London | SecureFix',
    description:
      'Office IT support in London — laptop fleets, desk setups, repairs, deployment and secure recycling for workplaces.',
    h1: 'Offices',
    accent: 'IT Support',
    keywords:
      'office IT support London, office laptop repair, workplace device management, business office IT SecureFix',
    intro:
      'Modern offices need standard laptop fleets, reliable meeting-room peripherals and a clear repair path when something fails. SecureFix supports London workplaces with procurement, desk-ready setup, on-site help and end-of-life recycling.',
    challenges: [
      {
        title: 'Hybrid work kits',
        text: 'Staff move between home and office and need portable, well-configured devices.',
      },
      {
        title: 'Inconsistent hardware',
        text: 'Ad-hoc buying leads to mismatched chargers, docks and support headaches.',
      },
      {
        title: 'Move and expansion projects',
        text: 'Office moves and headcount growth need coordinated device rollouts.',
      },
    ],
    howWeHelp: [
      {
        title: 'Standard office fleets',
        text: 'One clear laptop standard (or a small set of role profiles) for easier support.',
      },
      {
        title: 'Desk-side deployment',
        text: 'Devices delivered imaged, labelled and ready for the first login.',
      },
      {
        title: 'Workplace repairs',
        text: 'Screens, keyboards, batteries and docks fixed with collection or on-site options.',
      },
      {
        title: 'Move-day IT support',
        text: 'Help planning device packing, redeployment and secure disposal during office moves.',
      },
    ],
    services: [
      'Office laptop sourcing',
      'Docking & accessory kits',
      'Deployment and asset tagging',
      'Repair and call-out cover',
      'Secure office clear-out recycling',
    ],
    outcomes: [
      'Simpler support for IT and office managers',
      'Faster onboarding for new joiners',
      'Fewer mismatched devices and chargers',
      'Cleaner exits when staff or offices change',
    ],
  },
]

export function getIndustrySolution(slug: string | undefined): IndustrySolution | undefined {
  if (!slug) return undefined
  return industrySolutions.find((item) => item.slug === slug)
}
