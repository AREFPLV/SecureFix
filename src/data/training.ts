export type TrainingCourse = {
  title: string
  duration: string
  mode: string
  description: string
  highlights: string[]
}

export const trainingContent = {
  heroTitle: 'Training',
  heroAccent: 'Courses',
  heroSubtitle:
    'Hands-on phone, tablet and laptop repair training at our London workshop — learn from the technicians who fix devices every day.',
  intro: {
    title: 'Learn to repair with SecureFix',
    paragraphs: [
      'SecureFix runs practical device repair courses from our workshop at 218 City Road, London EC1V. Whether you want a new career, a side hustle, or skills for your own business, our trainers teach on real devices with the same tools and parts we use in the shop.',
      'Courses are kept small so you get proper guidance. Enquire below and we will help you pick the right programme and next available dates.',
    ],
  },
  courses: [
    {
      title: 'Smartphone & Tablet Repair',
      duration: '3–5 days or weekend sessions',
      mode: 'Onsite · London EC1V',
      description:
        'Core repairs for iPhone, Samsung, Google Pixel and popular tablets — screens, batteries, charging ports and diagnostics.',
      highlights: [
        'Screen and battery replacement',
        'Charging port and button repairs',
        'Safe teardown and reassembly',
        'Customer-ready quality checks',
      ],
    },
    {
      title: 'Laptop & MacBook Repair',
      duration: '3–5 days',
      mode: 'Onsite · London EC1V',
      description:
        'Practical laptop repair for Windows machines and MacBooks — screens, keyboards, batteries, storage upgrades and common faults.',
      highlights: [
        'Screen and keyboard work',
        'Battery and storage upgrades',
        'Charging and power issues',
        'Basic board-level awareness',
      ],
    },
    {
      title: 'Advanced & Micro-Soldering Intro',
      duration: 'By arrangement',
      mode: 'Onsite · London EC1V',
      description:
        'For technicians ready to go further — water damage recovery, board-level troubleshooting and an introduction to micro-soldering.',
      highlights: [
        'Water damage recovery basics',
        'Logic board fault finding',
        'Component-level repair intro',
        'Suitable after core courses',
      ],
    },
  ] satisfies TrainingCourse[],
  whoFor: {
    title: 'Who these courses are for',
    items: [
      {
        title: 'Beginners',
        description: 'No prior repair experience needed — we start from the fundamentals with guided practice.',
      },
      {
        title: 'Career changers',
        description: 'Build a skill you can use for employment, freelancing or starting your own repair service.',
      },
      {
        title: 'Businesses & teams',
        description: 'Upskill staff for in-house device support — ask us about corporate training dates.',
      },
    ],
  },
  faqs: [
    {
      question: 'Do I need my own tools?',
      answer:
        'No. Workshop tools and practice devices are provided during the course. We can advise on a starter toolkit if you want to continue practising at home.',
    },
    {
      question: 'Where are courses held?',
      answer:
        'Onsite at SecureFix, 218 City Road, London EC1V 2PN. Corporate sessions can be discussed for other London locations.',
    },
    {
      question: 'How do I book a place?',
      answer:
        'Call, WhatsApp or email us with the course you are interested in. We will confirm dates, pricing and availability.',
    },
  ],
}
