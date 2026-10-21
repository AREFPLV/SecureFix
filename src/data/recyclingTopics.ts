import { recyclingTopics as seoTopics } from '@/data/seoCatalog'

export type RecyclingTopicDetail = {
  slug: string
  equipmentDefault: string
  lead: string
  environment: string[]
  benefits: { icon: string; title: string; text: string }[]
}

const detailsBySlug: Record<string, Omit<RecyclingTopicDetail, 'slug'>> = {
  'phone-recycling': {
    equipmentDefault: 'Phones & tablets',
    lead:
      'SecureFix recycles iPhones, Samsung, Pixel and Android phones with secure data handling before materials are recovered.',
    environment: [
      'Recycling your phone is one of the simplest ways to cut e-waste. Handsets contain metals, plastics and battery materials that should not go into household bins.',
      'When you recycle with SecureFix, working parts can be recovered and the rest is processed through responsible channels. That keeps hazardous substances out of landfill and reduces the need to mine new materials.',
      'Choosing phone recycling is good for the environment: less waste, safer disposal, and a smaller carbon footprint than throwing a device away.',
    ],
    benefits: [
      {
        icon: '🌍',
        title: 'Less landfill waste',
        text: 'Phones stay out of general waste streams where batteries and metals can cause harm.',
      },
      {
        icon: '🔋',
        title: 'Safer battery handling',
        text: 'Lithium batteries are separated and processed correctly instead of being crushed in landfill.',
      },
      {
        icon: '🔁',
        title: 'Material recovery',
        text: 'Copper, aluminium and plastics can be recovered and used again in new products.',
      },
    ],
  },
  'laptop-recycling': {
    equipmentDefault: 'Laptops & desktops',
    lead:
      'Recycle MacBooks, Windows laptops, desktops and workstations with SecureFix. Storage is wiped or destroyed before recycling.',
    environment: [
      'Laptops and PCs hold large amounts of recoverable material. Recycling them keeps screens, boards and metals in a controlled process instead of landfill.',
      'Secure data wipe comes first, then responsible recycling. That protects your information while also helping the environment.',
      'Laptop recycling is good for the environment because it reduces e-waste, recovers valuable resources, and avoids the pollution linked to improper disposal.',
    ],
    benefits: [
      {
        icon: '💻',
        title: 'Fewer discarded computers',
        text: 'Office and home machines are processed properly instead of sitting in cupboards or skips.',
      },
      {
        icon: '🛠️',
        title: 'Parts reused where possible',
        text: 'Reusable components can extend another device’s life before final recycling.',
      },
      {
        icon: '🌱',
        title: 'Lower demand for raw materials',
        text: 'Recovered metals and plastics reduce pressure on mining and manufacturing.',
      },
    ],
  },
  'tablet-recycling': {
    equipmentDefault: 'Phones & tablets',
    lead:
      'SecureFix accepts iPads, Galaxy Tabs and Android tablets for secure wipe and responsible recycling in London.',
    environment: [
      'Tablets combine glass, batteries and circuit boards. Recycling them the right way stops those materials from polluting soil and waterways.',
      'We wipe personal data first, then recycle through compliant channels so the device does not become uncontrolled e-waste.',
      'Tablet recycling is good for the environment: it cuts landfill volume and supports cleaner recovery of glass, metals and battery materials.',
    ],
    benefits: [
      {
        icon: '📲',
        title: 'Glass and display recovery',
        text: 'Screens and glass are handled in controlled streams rather than mixed rubbish.',
      },
      {
        icon: '🔒',
        title: 'Data cleared before recycling',
        text: 'Accounts and files are removed so privacy and the planet are both protected.',
      },
      {
        icon: '🌿',
        title: 'Cleaner waste streams',
        text: 'Keeping tablets out of bin bags reduces contamination in general waste.',
      },
    ],
  },
  'data-destruction': {
    equipmentDefault: 'Mixed IT equipment',
    lead:
      'Certified data destruction for phones, laptops and drives — then responsible recycling of what remains.',
    environment: [
      'Secure destruction should not mean dumping hardware. After wiping or destroying storage, residual materials still need an environmentally sound route.',
      'SecureFix combines audit-ready data destruction with recycling so confidentiality and sustainability work together.',
      'Responsible data destruction plus recycling is good for the environment because devices are not abandoned once the data is gone — materials still get recovered.',
    ],
    benefits: [
      {
        icon: '📜',
        title: 'Proof for audits',
        text: 'Certificates document destruction while equipment continues into recycling.',
      },
      {
        icon: '🗑️',
        title: 'No forgotten hardware',
        text: 'Wiped devices are not left to pile up as informal e-waste.',
      },
      {
        icon: '🌍',
        title: 'Security with sustainability',
        text: 'Protect people and data without forgetting environmental duty of care.',
      },
    ],
  },
  'it-asset-disposal': {
    equipmentDefault: 'Mixed IT equipment',
    lead:
      'IT asset disposal for offices — phones, laptops, monitors and networking gear with secure recycling.',
    environment: [
      'Office clear-outs create sudden spikes in e-waste. Structured IT asset disposal keeps that equipment out of mixed skips and landfill.',
      'SecureFix provides chain-of-custody handling, data security and recycling so businesses retire assets cleanly.',
      'IT asset disposal done properly is good for the environment: fewer dumped machines, more recovered materials, and clearer accountability.',
    ],
    benefits: [
      {
        icon: '🏢',
        title: 'Office clear-outs done right',
        text: 'Fleets of devices leave the building through a controlled recycling path.',
      },
      {
        icon: '📦',
        title: 'Less mixed-skip waste',
        text: 'IT is separated from general rubbish where pollution risk is higher.',
      },
      {
        icon: '♻️',
        title: 'Higher recovery rates',
        text: 'Sorted equipment is easier to reuse or recycle effectively.',
      },
    ],
  },
  'hard-drive-destruction': {
    equipmentDefault: 'Mixed IT equipment',
    lead:
      'HDD and SSD destruction with secure wipe or physical destruction, then responsible recycling of residual materials.',
    environment: [
      'Drives contain metals and electronic components that should never be thrown into household waste after a wipe.',
      'We destroy or wipe media for security, then recycle what is left through approved channels.',
      'Hard drive destruction with recycling is good for the environment because storage media is kept out of landfill while your data stays protected.',
    ],
    benefits: [
      {
        icon: '💾',
        title: 'Secure end of life',
        text: 'Data cannot be recovered, and the shell still enters recycling.',
      },
      {
        icon: '🧲',
        title: 'Metal recovery',
        text: 'Drive casings and boards feed material recovery instead of tips.',
      },
      {
        icon: '🌱',
        title: 'Safer disposal',
        text: 'Avoids ad-hoc dumping of storage devices after office refreshes.',
      },
    ],
  },
  'weee-recycling': {
    equipmentDefault: 'Mixed IT equipment',
    lead:
      'WEEE-compliant electronics recycling for homes and businesses across London.',
    environment: [
      'WEEE rules exist because electrical waste can harm the environment if it is mixed with ordinary rubbish.',
      'SecureFix routes phones, computers and related IT through compliant recycling so materials can be recovered safely.',
      'WEEE recycling is good for the environment: it reduces pollution risk, supports recovery targets, and keeps hazardous fractions under control.',
    ],
    benefits: [
      {
        icon: '📋',
        title: 'Compliant processing',
        text: 'Electrical waste follows regulated recycling channels.',
      },
      {
        icon: '⚗️',
        title: 'Hazardous fractions controlled',
        text: 'Batteries and sensitive parts are handled separately where needed.',
      },
      {
        icon: '🌍',
        title: 'Measurable eco impact',
        text: 'Responsible recovery helps cut the footprint of discarded electronics.',
      },
    ],
  },
  'business-it-recycling': {
    equipmentDefault: 'Mixed IT equipment',
    lead:
      'Business IT recycling and office clear-outs with data security, reporting and London collection.',
    environment: [
      'Business upgrades create large volumes of retired devices. Recycling them together protects the environment better than piecemeal disposal.',
      'SecureFix supports SMEs and corporate teams with secure retirement, recycling and paperwork for records.',
      'Business IT recycling is good for the environment because whole fleets are diverted from landfill and materials are recovered at scale.',
    ],
    benefits: [
      {
        icon: '🚚',
        title: 'Fleet-scale diversion',
        text: 'Many devices leave the office in one controlled recycling job.',
      },
      {
        icon: '📊',
        title: 'Reporting you can keep',
        text: 'Documentation supports ESG and compliance conversations.',
      },
      {
        icon: '🌿',
        title: 'Corporate responsibility',
        text: 'Shows customers and staff that upgrades do not mean dumping hardware.',
      },
    ],
  },
}

export function getRecyclingTopic(slug: string | undefined) {
  if (!slug) return null
  const seo = seoTopics.find((topic) => topic.slug === slug)
  const detail = detailsBySlug[slug]
  if (!seo || !detail) return null
  return {
    ...seo,
    ...detail,
    slug,
  }
}

export { seoTopics as recyclingTopicList }
