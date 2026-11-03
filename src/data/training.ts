import { TRAINING_ROUTE } from '@/data/content'

export type TrainingLevelId = 'junior' | 'intermediate' | 'advance'

export type TrainingLevel = {
  id: TrainingLevelId
  label: string
  rank: 1 | 2 | 3
  price: number
  priceText: string
  sessions: number
  summary: string
  /** Short outcomes shown on the hub card. */
  outcomes: string[]
  /** Longer copy for the level detail page. */
  learnIntro: string
  learnDetails: string[]
  whoFor: string
}

export type TrainingCourse = {
  slug: string
  title: string
  accent: string
  sessions: number
  mode: string
  description: string
  levels: TrainingLevel[]
}

export function trainingCoursePath(courseSlug: string) {
  return `${TRAINING_ROUTE}/${courseSlug}`
}

export function trainingLevelPath(courseSlug: string, levelId: TrainingLevelId) {
  return `${TRAINING_ROUTE}/${courseSlug}/${levelId}`
}

export function formatTrainingPrice(price: number) {
  return `£${price.toLocaleString('en-GB')}`
}

const LEVEL_META: Record<
  TrainingLevelId,
  { label: string; rank: 1 | 2 | 3 }
> = {
  junior: { label: 'Junior', rank: 1 },
  intermediate: { label: 'Intermediate', rank: 2 },
  advance: { label: 'Advance', rank: 3 },
}

function level(
  id: TrainingLevelId,
  price: number,
  data: Omit<TrainingLevel, 'id' | 'label' | 'rank' | 'price' | 'priceText' | 'sessions'> & {
    sessions?: number
  },
): TrainingLevel {
  const meta = LEVEL_META[id]
  return {
    id,
    label: meta.label,
    rank: meta.rank,
    price,
    priceText: formatTrainingPrice(price),
    sessions: data.sessions ?? 5,
    summary: data.summary,
    outcomes: data.outcomes,
    learnIntro: data.learnIntro,
    learnDetails: data.learnDetails,
    whoFor: data.whoFor,
  }
}

export const trainingCourses: TrainingCourse[] = [
  {
    slug: 'mobile-phone-tablet-repair',
    title: 'Mobile Phone & Tablet Repair',
    accent: 'Mobile',
    sessions: 5,
    mode: 'Onsite · London EC1V',
    description:
      'Hands-on iPhone, Android and tablet repair — from safe teardown and screen work through diagnostics and board-level microsoldering.',
    levels: [
      level('junior', 499, {
        summary:
          'Build confident fundamentals: ESD-safe practice, parts ID, screens, batteries, ports, and device resets.',
        outcomes: [
          'ESD safety & tools',
          'Parts identification',
          'LCD / OLED replacement',
          'Battery replacement',
          'Port replacement',
          'Resets & backups',
        ],
        learnIntro:
          'Junior Mobile prepares you to open devices safely and complete the most requested phone and tablet repairs to a workshop standard.',
        learnDetails: [
          'Work ESD-safe: mats, grounding, anti-static handling, and the correct hand tools for phones and tablets.',
          'Identify common assemblies — displays, batteries, charging ports, cameras, flex cables — and match the right parts.',
          'Replace LCD and OLED screens with proper adhesive, alignment, and functional testing.',
          'Carry out battery replacements with safe disconnect, seating, and calibration checks.',
          'Swap damaged charging ports and related connectors without stressing the board.',
          'Perform factory resets, backups, and basic software recovery so devices leave ready for the customer.',
        ],
        whoFor:
          'Beginners and career starters who want a solid first repair skillset before moving into diagnostics and microsoldering.',
      }),
      level('intermediate', 899, {
        summary:
          'Move into diagnostics and service workflow — back glass, battery/charging fault finding, firmware, and intro microsoldering.',
        outcomes: [
          'Service workflow',
          'Diagnostics',
          'Back glass repair',
          'Battery diagnostics',
          'Charging diagnostics',
          'Firmware flashing',
          'Introduction to microsoldering',
        ],
        learnIntro:
          'Intermediate Mobile turns part-swapping into proper fault finding so you can diagnose before you replace and handle tougher cosmetic and power jobs.',
        learnDetails: [
          'Follow a repeatable service workflow from intake notes through diagnosis, repair, and quality check.',
          'Use structured diagnostics to separate hardware, software, and intermittent faults.',
          'Repair back glass and rear housings cleanly with heat control and adhesive technique.',
          'Diagnose battery health issues — swelling, rapid drain, false percentages — before committing to a replacement.',
          'Trace charging faults across cables, ports, docks, and related power paths.',
          'Flash and restore firmware where supported, and recover devices stuck after failed updates.',
          'Get an introduction to microsoldering setup, tip control, and simple board-side joints under magnification.',
        ],
        whoFor:
          'Students who already know basic screen and battery swaps and want diagnostics, workflow, and a path into board work.',
      }),
      level('advance', 1499, {
        summary:
          'Advanced lab skills: board architecture, OLED refurb, battery/charging IC faults, software analysis, and microsoldering.',
        outcomes: [
          'Advanced lab setup',
          'Board architecture',
          'OLED refurbishment',
          'Battery circuit faults',
          'Charging IC repair',
          'Software fault analysis',
          'Advanced microsoldering',
        ],
        learnIntro:
          'Advance Mobile is for technicians ready for board-level work — understanding power rails, display refurbishment, IC-level charging faults, and precision soldering.',
        learnDetails: [
          'Set up an advanced repair lab: microscope, hot air, soldering station, and safe board handling.',
          'Read board architecture at a practical level — power paths, common failure zones, and how assemblies talk to the logic board.',
          'Refurbish OLED assemblies where viable, including glass and adhesive practice used in professional workshops.',
          'Diagnose battery circuit faults beyond a simple pack swap, including related protection and sensing issues.',
          'Approach charging IC and power-management faults with measurement-led troubleshooting.',
          'Analyse software-side failures that mimic hardware problems and decide when to reflash versus repair.',
          'Practise advanced microsoldering on donor boards and controlled exercises used in SecureFix Academy labs.',
        ],
        whoFor:
          'Working technicians and Intermediate graduates aiming for board-level mobile repair careers.',
      }),
    ],
  },
  {
    slug: 'computer-laptop-repair',
    title: 'Computer & Laptop Repair',
    accent: 'PC & Laptop',
    sessions: 5,
    mode: 'Onsite · London EC1V',
    description:
      'Windows PC and laptop repair training — components, installs, storage, screens, networking, then board-level diagnostics.',
    levels: [
      level('junior', 499, {
        summary:
          'Learn the building blocks: components, Windows installs, storage swaps, screens, keyboards, and basic networking.',
        outcomes: [
          'Components',
          'Windows install',
          'SSD / HDD replacement',
          'Screens & keyboards',
          'Basic networking',
        ],
        learnIntro:
          'Junior Computer & Laptop gets you comfortable opening machines, installing Windows cleanly, and completing the everyday workshop jobs customers ask for.',
        learnDetails: [
          'Identify laptop and desktop components — RAM, storage, Wi-Fi cards, batteries, and display assemblies.',
          'Install and configure Windows, including drivers and a clean customer-ready setup.',
          'Replace HDD/SSD drives and verify boot order, SMART health, and basic performance.',
          'Swap screens and keyboards with correct cable routing and hinge care.',
          'Handle basic networking: Wi-Fi setup, Ethernet checks, and common connectivity faults.',
        ],
        whoFor:
          'Beginners who want practical PC and laptop skills for employment, freelancing, or supporting a small business fleet.',
      }),
      level('intermediate', 899, {
        summary:
          'Go deeper on architecture, recovery tools, cloning, careful disassembly, routers, and electronics basics.',
        outcomes: [
          'Architecture',
          'Recovery tools',
          'Cloning',
          'Disassembly',
          'Router setup',
          'Electronics basics',
        ],
        learnIntro:
          'Intermediate Computer builds diagnostic confidence — recovery, cloning, structured teardown, and enough electronics to understand what you are measuring.',
        learnDetails: [
          'Understand laptop architecture: power flow, common board layouts, and how subsystems fail together.',
          'Use recovery tools for boot loops, corrupted OS installs, and data-preserving rescue workflows.',
          'Clone drives safely and verify the clone before returning a machine.',
          'Disassemble complex chassis without broken clips, missing screws, or damaged cables.',
          'Set up and troubleshoot routers and local network issues that often arrive with “laptop won’t connect” jobs.',
          'Learn electronics basics used in repair: continuity, voltage checks, and reading simple schematics notes.',
        ],
        whoFor:
          'Students with Junior PC skills who want stronger diagnostics and workshop workflow for mixed Windows fleets.',
      }),
      level('advance', 1499, {
        summary:
          'Board-level laptop work: advanced diagnostics, SSD faults, motherboard repairs, and advanced electronics.',
        outcomes: [
          'Board-level understanding',
          'Advanced diagnostics',
          'SSD troubleshooting',
          'Motherboard repairs',
          'Troubleshooting',
          'Advanced electronics',
        ],
        learnIntro:
          'Advance Computer focuses on no-power and intermittent laptop faults, storage at a deeper level, and motherboard repair technique in a controlled lab.',
        learnDetails: [
          'Build board-level understanding of power rails, charging paths, and common dead-laptop failure points.',
          'Run advanced diagnostics with measurement-led steps instead of guess-and-swap.',
          'Troubleshoot SSD and storage faults that go beyond a simple drive replacement.',
          'Practise motherboard repair approaches used in SecureFix labs, including heat and component work on donor boards.',
          'Structure complex troubleshooting for intermittent, overheating, and liquid-related laptop cases.',
          'Apply advanced electronics concepts needed to interpret readings and plan a safe repair.',
        ],
        whoFor:
          'Technicians ready for board-level laptop repair after Intermediate Computer or equivalent workshop experience.',
      }),
    ],
  },
  {
    slug: 'apple-device-repair',
    title: 'Apple Device Repair',
    accent: 'Apple',
    sessions: 5,
    mode: 'Onsite · London EC1V',
    description:
      'Apple-focused training across iPhone, iPad and Mac workflows — parts, firmware, diagnostics, and advanced board repair.',
    levels: [
      level('junior', 699, {
        summary:
          'Apple model overview plus core repairs: screens, batteries, parts replacement, install and recovery.',
        outcomes: [
          'Models overview',
          'Screens & batteries',
          'Basic repairs',
          'Parts replacement',
          'Install & recovery',
        ],
        learnIntro:
          'Junior Apple covers the devices you will see every day — recognising models, completing core parts jobs, and recovering software cleanly.',
        learnDetails: [
          'Learn Apple model families and how part compatibility changes across generations.',
          'Replace screens and batteries with Apple-specific adhesive, sealing, and test routines.',
          'Complete basic repairs customers request most often, with tidy reassembly and cosmetic care.',
          'Source and fit the correct replacement parts, including genuine vs quality compatible choices.',
          'Carry out install and recovery workflows so devices activate and update correctly after repair.',
        ],
        whoFor:
          'Beginners aiming specifically at Apple repair work in a shop, mobile service, or their own business.',
      }),
      level('intermediate', 999, {
        summary:
          'Apple service workflow, advanced repairs, display/charging/battery jobs, firmware restore, and intro microsoldering.',
        outcomes: [
          'Service workflow',
          'Advanced repairs',
          'Display / charging',
          'Display / battery',
          'Firmware restore',
          'Introduction to microsoldering',
        ],
        learnIntro:
          'Intermediate Apple strengthens diagnostics and service process — combined display/power jobs, firmware restore, and a first step into microsoldering.',
        learnDetails: [
          'Run an Apple-focused service workflow from booking notes through quality control and handover.',
          'Handle advanced repairs that combine multiple faults in one device.',
          'Diagnose and repair display and charging issues that are not fixed by a simple part swap.',
          'Work through display and battery interactions, including warning messages and calibration behaviour.',
          'Restore firmware and recover devices that will not boot or update normally.',
          'Start microsoldering with Apple board practice pieces under magnification.',
        ],
        whoFor:
          'Students who can already do Junior Apple jobs and want firmware confidence plus a route into board-level Apple work.',
      }),
      level('advance', 1499, {
        summary:
          'Advanced Apple diagnostics, logic-board repair, deep troubleshooting, and advanced microsoldering.',
        outcomes: [
          'Advanced diagnostics',
          'Board repair',
          'Logic board diagnostics',
          'Advanced troubleshooting',
          'Advanced microsoldering',
        ],
        learnIntro:
          'Advance Apple is board-level: measuring, diagnosing logic boards, planning repairs, and practising advanced microsoldering used on Apple devices.',
        learnDetails: [
          'Use advanced diagnostics to separate software locks, assembly faults, and true logic-board failures.',
          'Plan and practise board repair sequences on training boards before touching customer devices.',
          'Read logic-board behaviour for no-power, no-image, and charging failures common on Apple hardware.',
          'Build advanced troubleshooting habits for liquid damage, intermittent boots, and multi-symptom cases.',
          'Develop advanced microsoldering control for fine-pitch work under the microscope.',
        ],
        whoFor:
          'Experienced Apple technicians and Intermediate graduates preparing for logic-board repair roles.',
      }),
    ],
  },
]

export function getTrainingCourse(slug?: string | null) {
  if (!slug) return undefined
  return trainingCourses.find((course) => course.slug === slug)
}

export function getTrainingLevel(courseSlug?: string | null, levelId?: string | null) {
  const course = getTrainingCourse(courseSlug)
  if (!course || !levelId) return undefined
  const levelMatch = course.levels.find((item) => item.id === levelId)
  if (!levelMatch) return undefined
  return { course, level: levelMatch }
}

export const trainingContent = {
  heroTitle: 'SecureFix',
  heroAccent: 'Academy',
  heroSubtitle:
    'Professional repair training in London — three programmes, three levels each. Learn on equipped classroom benches with the tools our technicians use every day.',
  intro: {
    title: 'Professional Repair Training Programme',
    paragraphs: [
      'SecureFix Academy runs practical courses from our workshop at 218 City Road, London EC1V. Each programme has Junior, Intermediate and Advance levels so you can start at the right point and progress with clear outcomes.',
      'Classes are kept small. Training benches are equipped with the same tools, practice devices and parts flow we use in the shop. Enquire below and we will help you pick a course, level and next available dates.',
    ],
  },
  whoFor: {
    title: 'Who these courses are for',
    items: [
      {
        title: 'Beginners',
        description: 'Start at Junior — no prior repair experience needed. We teach from ESD-safe fundamentals upward.',
      },
      {
        title: 'Working technicians',
        description: 'Jump to Intermediate or Advance to add diagnostics, firmware and board-level skills.',
      },
      {
        title: 'Businesses & teams',
        description: 'Upskill staff for in-house device support — ask us about corporate training dates.',
      },
    ],
  },
  faqs: [
    {
      question: 'How many sessions is each level?',
      answer:
        'Each level is taught across 5 sessions at our London workshop. We will confirm the timetable when you enquire.',
    },
    {
      question: 'Do I need my own tools?',
      answer:
        'No. Classroom benches are equipped with tools and practice devices during the course. We can advise on a starter toolkit if you want to continue at home.',
    },
    {
      question: 'Where are courses held?',
      answer:
        'Onsite at SecureFix, 218 City Road, London EC1V 2PN. Corporate sessions can be discussed for other London locations.',
    },
    {
      question: 'How do I book a place?',
      answer:
        'Call, WhatsApp or email us with the course and level you want. We will confirm dates, pricing and availability.',
    },
  ],
}
