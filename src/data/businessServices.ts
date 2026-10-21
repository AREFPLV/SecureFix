export type BusinessServiceBlock = {
  icon: string
  title: string
  description: string
}

export type BusinessServiceStep = {
  step: string
  title: string
  description: string
}

export type BusinessServiceDetail = {
  slug: string
  icon: string
  cardTitle: string
  cardDescription: string
  hero: {
    title: string
    accent: string
    subtitle: string
    eyebrow?: string
    image?: string
    /** Photo hero: put copy on the left (default) or right */
    align?: 'left' | 'right'
  }
  whatIsIt: string
  intro: string
  whatWeDo: BusinessServiceBlock[]
  highlights: string[]
  whoFor: string[]
  process: BusinessServiceStep[]
  ctaTitle: string
  ctaText: string
}

export const businessServices: BusinessServiceDetail[] = [
  {
    slug: 'procurement',
    icon: '💻',
    cardTitle: 'Business Laptop Sourcing',
    cardDescription: 'Source the right devices at competitive rates for your team size and workload.',
    hero: {
      title: 'Smart IT Hardware Procurement',
      accent: 'Built for Growing Teams',
      eyebrow: 'Lifecycle | Procurement',
      image: '/images/procurement-hero.png',
      subtitle:
        'Streamline your fleet and optimize budget with secure sourcing, rapid deployment, and proactive management of your entire device lifecycle. From laptops to entire office fit-outs, get tailored hardware solutions backed by fast UK deployment and ongoing support.',
    },
    whatIsIt:
      'Business laptop procurement is the process of selecting, buying and supplying work laptops that match your staff roles, budget and IT standards.',
    intro:
      'SecureFix manages business laptop buying end to end. Tell us your team size, budget and software needs, and we recommend the right devices from trusted brands, then handle ordering, delivery and optional setup.',
    whatWeDo: [
      {
        icon: '🔍',
        title: 'Needs Assessment',
        description:
          'We review how your staff work, which apps they use, and what performance, battery life and portability you need.',
      },
      {
        icon: '💷',
        title: 'Competitive Sourcing',
        description:
          'We source Dell, HP, Lenovo, Microsoft and Apple devices at business-friendly prices for single units or bulk orders.',
      },
      {
        icon: '📋',
        title: 'Spec Matching',
        description:
          'Every laptop is matched to the role, from office staff and designers to field teams and executives.',
      },
      {
        icon: '📦',
        title: 'Supply & Delivery',
        description:
          'We arrange supply and delivery to your office, with optional staging so devices arrive ready to use.',
      },
      {
        icon: '⚙️',
        title: 'Optional Setup',
        description:
          'Add OS imaging, security, accounts and company software so laptops are desk-ready on arrival.',
      },
      {
        icon: '🔁',
        title: 'Refresh Planning',
        description:
          'We help plan upgrade cycles and trade-in or recycling of old devices when it is time to refresh.',
      },
    ],
    highlights: ['Dell', 'HP', 'Lenovo', 'Microsoft', 'Apple'],
    whoFor: [
      'SMEs refreshing staff laptops',
      'Growing teams that need fast onboarding kits',
      'Offices standardising on one trusted brand',
      'Businesses wanting buy, configure and support in one place',
    ],
    process: [
      {
        step: '01',
        title: 'Tell us your needs',
        description: 'Share headcount, budget, preferred brands and any software or security requirements.',
      },
      {
        step: '02',
        title: 'Get a clear quote',
        description: 'We recommend models and options with transparent pricing and lead times.',
      },
      {
        step: '03',
        title: 'Approve and order',
        description: 'Once you approve, we place the order and keep you updated on delivery.',
      },
      {
        step: '04',
        title: 'Receive ready devices',
        description: 'Devices arrive as ordered, or fully configured if you add setup and deployment.',
      },
    ],
    ctaTitle: 'Need Laptops for Your Team?',
    ctaText:
      'Tell SecureFix what you need and we will source the right business devices with clear pricing and optional setup.',
  },
  {
    slug: 'deployment',
    icon: '🚀',
    cardTitle: 'End-to-End Deployment',
    cardDescription: 'From unboxing to desk-ready setup, we handle staging, imaging and delivery.',
    hero: {
      title: 'End-to-End',
      accent: 'Deployment',
      eyebrow: 'Lifecycle | Deployment',
      image: '/images/deployment-hero.png',
      align: 'right',
      subtitle:
        'We take new or refreshed devices from the box to your staff desks — staged, imaged, labelled and ready for same-day business IT deployment across London.',
    },
    whatIsIt:
      'End-to-end deployment means SecureFix prepares, configures, tracks and delivers devices so your team can start working with minimal downtime.',
    intro:
      'Whether you are onboarding ten people or rolling out a full office refresh, we manage staging, imaging, asset tagging and desk-side delivery so your internal IT team is not overloaded.',
    whatWeDo: [
      {
        icon: '📦',
        title: 'Staging & Unboxing',
        description: 'Devices are checked in, inspected and prepared in our workflow before they reach your staff.',
      },
      {
        icon: '💾',
        title: 'Imaging & Baseline Setup',
        description: 'We apply your standard image or baseline so every device follows the same company setup.',
      },
      {
        icon: '🏷️',
        title: 'Asset Tagging',
        description: 'Each device can be labelled and logged for easier tracking, warranty and support later.',
      },
      {
        icon: '☁️',
        title: 'Cloud & Account Join',
        description: 'We connect devices to your required cloud, email or directory setup where needed.',
      },
      {
        icon: '🚚',
        title: 'Desk-Side Delivery',
        description: 'Finished devices can be delivered to your office or multi-site locations across London.',
      },
      {
        icon: '📊',
        title: 'Rollout Reporting',
        description: 'You get a clear view of what was deployed, to whom, and what remains outstanding.',
      },
    ],
    highlights: ['Staging', 'Imaging', 'Asset Tags', 'Delivery', 'Reporting'],
    whoFor: [
      'Companies hiring or expanding quickly',
      'Businesses replacing large device batches',
      'Teams without time for in-house unboxing and setup',
      'Multi-site offices that need coordinated rollouts',
    ],
    process: [
      {
        step: '01',
        title: 'Plan the rollout',
        description: 'We agree quantities, locations, timelines and the setup standard for each device.',
      },
      {
        step: '02',
        title: 'Prepare every unit',
        description: 'Devices are staged, imaged, secured and tagged before leaving our process.',
      },
      {
        step: '03',
        title: 'Deliver to your team',
        description: 'We deliver desk-ready machines to your office or agreed collection point.',
      },
      {
        step: '04',
        title: 'Confirm completion',
        description: 'You receive handover notes and reporting so support can continue smoothly.',
      },
    ],
    ctaTitle: 'Need a Smooth Device Rollout?',
    ctaText: 'Let SecureFix handle staging, setup and delivery so your staff get working devices faster.',
  },
  {
    slug: 'os-setup',
    icon: '⚙️',
    cardTitle: 'OS & Software Setup',
    cardDescription: 'Windows or macOS configured with your apps, accounts and company policies.',
    hero: {
      title: 'OS & Software',
      accent: 'Setup',
      eyebrow: 'Lifecycle | OS Setup',
      image: '/images/os-setup-hero.jpg',
      subtitle:
        'We configure Windows or macOS with the apps, accounts and policies your business needs before staff log in.',
    },
    whatIsIt:
      'OS and software setup is the process of preparing the operating system, business apps, user accounts and company settings so a laptop is ready for work.',
    intro:
      'SecureFix builds a consistent setup for your fleet. That can include Windows or macOS, email, Microsoft 365 or Google Workspace, antivirus, VPN, printers and the tools each role needs.',
    whatWeDo: [
      {
        icon: '🪟',
        title: 'Windows / macOS Configuration',
        description: 'We install and configure the OS version your business prefers and keep it update-ready.',
      },
      {
        icon: '👤',
        title: 'User Accounts & Profiles',
        description: 'Staff accounts, profiles and access settings are prepared for a clean first login.',
      },
      {
        icon: '📧',
        title: 'Email & Productivity Apps',
        description: 'Outlook, Teams, Microsoft 365, Google Workspace and similar tools can be ready on arrival.',
      },
      {
        icon: '🛡️',
        title: 'Security Basics',
        description: 'Antivirus, encryption options and update settings can be included in the baseline.',
      },
      {
        icon: '📡',
        title: 'Network Ready',
        description: 'Wi-Fi profiles, VPN clients and printer access can be set up where required.',
      },
      {
        icon: '✅',
        title: 'Pre-Delivery Testing',
        description: 'We test the setup before handover so issues are caught before the device reaches staff.',
      },
    ],
    highlights: ['Windows', 'macOS', 'Microsoft 365', 'VPN', 'Antivirus'],
    whoFor: [
      'Businesses that want identical setups across staff',
      'Teams using mixed Windows and Apple devices',
      'Companies onboarding new starters regularly',
      'Offices that need role-based software packs',
    ],
    process: [
      {
        step: '01',
        title: 'Define your standard',
        description: 'We list the OS, apps, accounts and policies every device should include.',
      },
      {
        step: '02',
        title: 'Build the baseline',
        description: 'SecureFix configures the image or setup pack for your roles.',
      },
      {
        step: '03',
        title: 'Apply to each device',
        description: 'Every laptop is set up and checked against your agreed checklist.',
      },
      {
        step: '04',
        title: 'Hand over ready to use',
        description: 'Staff receive devices that are already prepared for day-one work.',
      },
    ],
    ctaTitle: 'Want Devices Ready on Day One?',
    ctaText: 'Ask SecureFix to configure OS, apps and accounts before your team receives their laptops.',
  },
  {
    slug: 'security',
    icon: '🔐',
    cardTitle: 'Security & Compliance',
    cardDescription: 'Encryption, antivirus, updates and controls aligned to your security needs.',
    hero: {
      title: 'Security &',
      accent: 'Compliance',
      eyebrow: 'Lifecycle | Security',
      image: '/images/security-hero.jpg',
      subtitle:
        'We help protect business devices with encryption, antivirus, updates and practical controls that support your security goals.',
    },
    whatIsIt:
      'Security and compliance for business devices means putting the right protections in place so company data stays safer and your IT standards are easier to follow.',
    intro:
      'SecureFix can harden laptops before they go out and support ongoing security basics such as encryption, managed antivirus, update readiness and secure handling when devices leave the business.',
    whatWeDo: [
      {
        icon: '🔑',
        title: 'Disk Encryption',
        description: 'BitLocker and similar encryption options help protect data if a device is lost or stolen.',
      },
      {
        icon: '🛡️',
        title: 'Managed Antivirus',
        description: 'We can install and configure business antivirus as part of your device baseline.',
      },
      {
        icon: '🔄',
        title: 'Update Readiness',
        description: 'Devices are prepared to receive OS and security updates so protection stays current.',
      },
      {
        icon: '👮',
        title: 'Access Controls',
        description: 'User access, admin rights and basic policy settings can be aligned to your rules.',
      },
      {
        icon: '🗑️',
        title: 'Secure End of Life',
        description: 'When devices retire, we can support secure wipe and responsible recycling.',
      },
      {
        icon: '📄',
        title: 'Clear Documentation',
        description: 'You get practical notes on what was applied so your records stay easier to manage.',
      },
    ],
    highlights: ['Encryption', 'Antivirus', 'Updates', 'Access Control', 'Secure Wipe'],
    whoFor: [
      'Businesses handling customer or staff data',
      'Offices that need stronger laptop protection',
      'Teams preparing for audits or policy checks',
      'Companies retiring old devices securely',
    ],
    process: [
      {
        step: '01',
        title: 'Review your requirements',
        description: 'We discuss the security controls your business needs on each device.',
      },
      {
        step: '02',
        title: 'Apply protections',
        description: 'Encryption, antivirus and related settings are configured during setup.',
      },
      {
        step: '03',
        title: 'Verify the baseline',
        description: 'We check that protections are active before devices are handed over.',
      },
      {
        step: '04',
        title: 'Support the lifecycle',
        description: 'Ongoing repair, refresh and secure disposal can stay with SecureFix.',
      },
    ],
    ctaTitle: 'Need Stronger Device Security?',
    ctaText: 'Talk to SecureFix about encryption, antivirus and secure handling for your business devices.',
  },
  {
    slug: 'support',
    icon: '🛠️',
    cardTitle: 'Support & Maintenance',
    cardDescription: 'Ongoing repair, health checks and replacements to keep fleets running.',
    hero: {
      title: 'Support &',
      accent: 'Maintenance',
      eyebrow: 'Lifecycle | Support',
      image: '/images/support-hero.jpg',
      subtitle:
        'Keep your business devices working with repair, health checks, replacements and practical ongoing support from SecureFix.',
    },
    whatIsIt:
      'Support and maintenance is the ongoing care of your device fleet, from fixing faults and replacing parts to keeping machines usable for as long as possible.',
    intro:
      'SecureFix supports business laptops and related devices with same-day repair capability in London, warranty handling where applicable, and practical help when staff devices fail.',
    whatWeDo: [
      {
        icon: '🔧',
        title: 'Business Device Repair',
        description: 'Screens, batteries, keyboards, ports and more repaired with genuine or premium-quality parts.',
      },
      {
        icon: '⚡',
        title: 'Fast Turnaround',
        description: 'Many repairs can be completed the same day so staff downtime stays low.',
      },
      {
        icon: '🩺',
        title: 'Health Checks',
        description: 'We can review device condition and flag likely failures before they disrupt work.',
      },
      {
        icon: '🔁',
        title: 'Loan / Swap Options',
        description: 'Where available, we can help keep teams productive while a device is being repaired.',
      },
      {
        icon: '📜',
        title: 'Warranty Support',
        description: 'We help manage repair paths and warranty-related work where it applies.',
      },
      {
        icon: '🏢',
        title: 'Business-Friendly Service',
        description: 'Collection, drop-off and clear reporting options for offices and multi-user fleets.',
      },
    ],
    highlights: ['Same-Day Repair', 'Parts', 'Health Checks', 'Collection', 'Fleet Support'],
    whoFor: [
      'Offices that cannot afford long device downtime',
      'Businesses with mixed laptop fleets',
      'Teams needing one local repair partner',
      'Companies that want proactive device care',
    ],
    process: [
      {
        step: '01',
        title: 'Report the issue',
        description: 'Tell us the device, fault and how urgent the repair is for your team.',
      },
      {
        step: '02',
        title: 'Diagnose quickly',
        description: 'We confirm the problem and the best repair or replacement path.',
      },
      {
        step: '03',
        title: 'Fix and test',
        description: 'Repairs are completed, tested and prepared for return to your staff.',
      },
      {
        step: '04',
        title: 'Return to service',
        description: 'The device goes back into use with clear notes for your records.',
      },
    ],
    ctaTitle: 'Need Ongoing Device Support?',
    ctaText: 'SecureFix can repair, check and maintain your business devices so your team stays productive.',
  },
  {
    slug: 'lifecycle-management',
    icon: '🔄',
    cardTitle: 'Device Lifecycle Management',
    cardDescription: 'Full control from purchase through refresh, recycle and secure disposal.',
    hero: {
      title: 'Device Lifecycle',
      accent: 'Management',
      eyebrow: 'Lifecycle | Full Management',
      image: '/images/lifecycle-management-hero.jpg',
      subtitle:
        'From first purchase to secure retirement, SecureFix helps you manage business devices with less waste, less risk and clearer control.',
    },
    whatIsIt:
      'Device lifecycle management covers the full life of a business device: buying, setup, support, refresh and secure disposal when it is no longer needed.',
    intro:
      'Instead of handling procurement, repair and recycling separately, SecureFix can support the whole journey. That helps you control cost, reduce downtime and retire devices securely.',
    whatWeDo: [
      {
        icon: '🛒',
        title: 'Buy the Right Devices',
        description: 'Start with procurement that matches roles, budget and expected lifespan.',
      },
      {
        icon: '⚙️',
        title: 'Configure & Deploy',
        description: 'Devices are set up and rolled out ready for staff, with clear asset visibility.',
      },
      {
        icon: '🛠️',
        title: 'Support Through Use',
        description: 'Repairs, health checks and replacements keep the fleet useful for longer.',
      },
      {
        icon: '📈',
        title: 'Plan Refreshes',
        description: 'We help you decide when to upgrade instead of waiting for sudden failures.',
      },
      {
        icon: '🔐',
        title: 'Secure Data Erasure',
        description: 'Old devices can be wiped properly before reuse, resale or recycling.',
      },
      {
        icon: '♻️',
        title: 'Responsible Retirement',
        description: 'End-of-life equipment can move into SecureFix recycling with documentation options.',
      },
    ],
    highlights: ['Buy', 'Deploy', 'Support', 'Refresh', 'Recycle'],
    whoFor: [
      'Businesses that want one partner for the full device journey',
      'Offices planning scheduled laptop refreshes',
      'Companies concerned about data on retired devices',
      'Teams trying to reduce IT admin overhead',
    ],
    process: [
      {
        step: '01',
        title: 'Map your fleet',
        description: 'We review what you have, what needs repair, and what is due for refresh.',
      },
      {
        step: '02',
        title: 'Set the plan',
        description: 'Procurement, support and retirement steps are agreed around your budget and timeline.',
      },
      {
        step: '03',
        title: 'Run the lifecycle',
        description: 'SecureFix supports buying, setup, repair and replacement as needed.',
      },
      {
        step: '04',
        title: 'Retire securely',
        description: 'Old devices are wiped and recycled responsibly when they leave service.',
      },
    ],
    ctaTitle: 'Want Full Lifecycle Control?',
    ctaText:
      'Let SecureFix manage business devices from purchase to secure recycling with one clear process.',
  },
]

export function getBusinessService(slug: string): BusinessServiceDetail | undefined {
  return businessServices.find((service) => service.slug === slug)
}

export function businessServiceRoute(slug: string): string {
  return `/lifecycle/${slug}`
}
