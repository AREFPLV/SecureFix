/**
 * CEO-friendly SEO copy for Business IT service and industry pages.
 * Informed by common London MSP / lifecycle patterns (procurement, deployment,
 * managed devices, sector IT) while staying specific to SecureFix workshop strengths.
 * Peer patterns reviewed include Speedster IT, SyncraIT, MyNerd, 1st IT, Foxcomm,
 * Verge Tech, PC Macgicians and 360 IT Support (procurement, desk-ready imaging,
 * sector pages for law, care, hospitality, education and construction).
 */

export type BusinessFaq = { question: string; answer: string }

export type BusinessSeoExtra = {
  executiveSummary: string
  ceoOutcomes: { title: string; text: string }[]
  faqs: BusinessFaq[]
}

/** Hub-level SEO for /lifecycle (Business IT). */
export const businessHubSeo: BusinessSeoExtra = {
  executiveSummary:
    'SecureFix for Business is a London device lifecycle partner — we source business laptops, configure them desk-ready, deploy to your sites, repair when hardware fails, and retire devices with secure wipe. Leadership gets one accountable workshop instead of juggling distributors, high-street repairs and incomplete asset records.',
  ceoOutcomes: [
    {
      title: 'One vendor conversation',
      text: 'Buy, image, support and recycle through SecureFix so finance and ops are not chasing multiple suppliers.',
    },
    {
      title: 'Day-one productivity',
      text: 'Devices can arrive imaged with accounts, security baselines and asset tags — not blank boxes.',
    },
    {
      title: 'Lower downtime risk',
      text: 'Same-day and next-day repair options for phones and laptops keep revenue teams working.',
    },
  ],
  faqs: [
    {
      question: 'Is SecureFix a full managed MSP?',
      answer:
        'We specialise in hardware lifecycle — procurement, deployment, repair and recycling. We work alongside your MSP or internal IT for network and cloud where needed.',
    },
    {
      question: 'Which brands do you supply and support?',
      answer:
        'Dell, HP, Lenovo, Microsoft and Apple fleets are routine, plus smartphone and tablet repair for mixed mobile estates.',
    },
    {
      question: 'Do you cover industry-specific workplaces?',
      answer:
        'Yes. Dedicated solution pages cover corporate offices, schools, hospitality, construction, law firms, care homes, hotels, airports and more across London.',
    },
  ],
}

export const businessServiceSeo: Record<string, BusinessSeoExtra> = {
  procurement: {
    executiveSummary:
      'SecureFix Business Laptop Sourcing gives leadership a single London partner to specify, price and supply work devices without juggling distributors. Like specialist IT procurement providers, we align hardware to roles and budget — then optionally configure desk-ready builds so finance and operations can approve spend with confidence.',
    ceoOutcomes: [
      {
        title: 'Budget clarity',
        text: 'Comparable quotes for Dell, HP, Lenovo, Microsoft and Apple fleets — scaled from starter kits to multi-site refresh programmes.',
      },
      {
        title: 'Faster onboarding',
        text: 'Devices can arrive imaged and labelled, so new starters are productive on day one instead of waiting on IT tickets.',
      },
      {
        title: 'Lower hidden cost',
        text: 'Right-sized specs reduce overbuying high-end machines for light office roles while protecting power users who need performance.',
      },
    ],
    faqs: [
      {
        question: 'Can SecureFix procure and configure in one order?',
        answer:
          'Yes. Sourcing can include OS setup, security baselines, accounts and asset tags so laptops arrive ready for staff — not as blank boxes.',
      },
      {
        question: 'Do you support mixed Windows and Apple fleets?',
        answer:
          'Yes. We regularly supply and prepare mixed environments for SMEs and professional firms across London.',
      },
      {
        question: 'How quickly can you quote a team refresh?',
        answer:
          'Share headcount, roles and budget. We return a clear model shortlist and lead times so leadership can approve without a long RFP cycle.',
      },
    ],
  },
  deployment: {
    executiveSummary:
      'End-to-end deployment turns hardware deliveries into controlled rollouts. SecureFix stages, images, tracks and delivers devices so operations leaders avoid chaotic unboxing days and shadow IT setups.',
    ceoOutcomes: [
      {
        title: 'Predictable rollouts',
        text: 'Bulk staging and asset tracking give you a clean record of what shipped, to whom, and when.',
      },
      {
        title: 'Less internal drag',
        text: 'Your managers stay focused on customers while SecureFix handles imaging, labelling and desk-side delivery.',
      },
      {
        title: 'Audit-ready handover',
        text: 'Deployment packs document configuration baselines useful for insurance, cyber questionnaires and board reporting.',
      },
    ],
    faqs: [
      {
        question: 'Can you deploy across multiple London sites?',
        answer:
          'Yes. Multi-site and phased rollouts are available, including swap kits for staff who cannot go offline.',
      },
      {
        question: 'Do you integrate with our Microsoft 365 tenant?',
        answer:
          'We can prepare devices for your cloud accounts, email and company apps as part of the deployment pack.',
      },
      {
        question: 'What reporting do we receive after rollout?',
        answer:
          'You receive asset-level confirmation of devices prepared and delivered, suitable for finance and IT ownership records.',
      },
    ],
  },
  'os-setup': {
    executiveSummary:
      'OS and software setup standardises every laptop before it reaches a desk. Leaders get consistent security, apps and accounts — reducing “it works differently on my machine” support noise.',
    ceoOutcomes: [
      {
        title: 'Standard baseline',
        text: 'Windows or macOS images with your productivity stack, policies and naming conventions.',
      },
      {
        title: 'Security first',
        text: 'Encryption, antivirus and update posture applied before staff log in for the first time.',
      },
      {
        title: 'Cleaner support metrics',
        text: 'Fewer first-week tickets when devices ship already joined to email, cloud drives and VPN profiles.',
      },
    ],
    faqs: [
      {
        question: 'Can setup follow our company policy checklist?',
        answer:
          'Yes. Share your required apps, MFA expectations and folder standards and we build that into the imaging checklist.',
      },
      {
        question: 'Do you support both Windows and macOS?',
        answer:
          'Yes. SecureFix prepares both platforms for London offices running mixed fleets.',
      },
      {
        question: 'Is this available without buying hardware from you?',
        answer:
          'Often yes — bring-your-own or already-purchased devices can be staged and configured under the same process.',
      },
    ],
  },
  security: {
    executiveSummary:
      'Security and compliance for business devices protects revenue and reputation. SecureFix hardens endpoints with encryption, malware defence and update discipline aligned to SME cyber expectations.',
    ceoOutcomes: [
      {
        title: 'Reduced breach exposure',
        text: 'Lost or stolen laptops are far less dangerous when disks are encrypted and accounts follow strong access practices.',
      },
      {
        title: 'Insurer and client confidence',
        text: 'Documented controls help when customers, landlords or cyber insurers ask how you protect data.',
      },
      {
        title: 'Operational continuity',
        text: 'Patch and antivirus hygiene cut malware downtime that otherwise hits billing and service delivery.',
      },
    ],
    faqs: [
      {
        question: 'Is this a full SOC / MDR service?',
        answer:
          'SecureFix focuses on device-level security, setup and repair. We can align endpoints to your wider cyber stack and partners where needed.',
      },
      {
        question: 'Do you help with Cyber Essentials readiness on devices?',
        answer:
          'We apply practical endpoint controls — encryption, updates, antivirus and account hygiene — that support common SME security baselines.',
      },
      {
        question: 'Can security be included in procurement?',
        answer:
          'Yes. Many clients bundle sourcing, imaging and security baseline into one quote for new starters and refresh cycles.',
      },
    ],
  },
  support: {
    executiveSummary:
      'Support and maintenance keep fleets earning. SecureFix combines workshop repair speed with business call-outs so a cracked screen or dead battery does not stall a revenue team for days.',
    ceoOutcomes: [
      {
        title: 'Shorter downtime',
        text: 'Same-day and next-day repair options for phones, laptops and related business devices across London.',
      },
      {
        title: 'One accountable partner',
        text: 'Buy, fix and refresh through SecureFix instead of scattering warranties across unknown high-street shops.',
      },
      {
        title: 'Health-check cadence',
        text: 'Planned checks catch failing batteries and storage before they become emergency outages.',
      },
    ],
    faqs: [
      {
        question: 'Do you offer on-site business call-outs?',
        answer:
          'Yes for London postcodes. We can also collect, repair and return when workshop work is faster or safer.',
      },
      {
        question: 'Can you cover phones as well as laptops?',
        answer:
          'Yes. SecureFix is a repair-led business IT partner — smartphone, tablet and laptop fleets are all in scope.',
      },
      {
        question: 'How are SLAs agreed?',
        answer:
          'We agree priorities at quote stage based on device criticality, spare stock needs and your operating hours.',
      },
    ],
  },
  'lifecycle-management': {
    executiveSummary:
      'Device lifecycle management gives the board one story from purchase to secure retirement. SecureFix connects sourcing, deployment, support and certified recycling so IT spend stays controlled and auditable.',
    ceoOutcomes: [
      {
        title: 'Total cost visibility',
        text: 'Refresh planning replaces surprise hardware spikes with a predictable upgrade rhythm.',
      },
      {
        title: 'Compliance on exit',
        text: 'Secure wipe and recycling reduce data-risk when staff leave or sites close.',
      },
      {
        title: 'ESG-friendly IT',
        text: 'Responsible disposal and reuse pathways support sustainability reporting without slowing operations.',
      },
    ],
    faqs: [
      {
        question: 'Do you issue destruction certificates?',
        answer:
          'For eligible recycling jobs we provide documentation of secure processing to support audits and client due diligence.',
      },
      {
        question: 'Can lifecycle cover phones and laptops together?',
        answer:
          'Yes. Mixed mobile and laptop fleets are common for SecureFix business clients across London.',
      },
      {
        question: 'How do refresh cycles usually run?',
        answer:
          'Most SMEs plan 3–4 year laptop refreshes. We map warranty status, failure rates and role needs into a phased replacement plan.',
      },
    ],
  },
}

export const industrySolutionSeo: Record<string, BusinessSeoExtra> = {
  'businesses-corporate': {
    executiveSummary:
      'Corporate and SME teams need devices that onboard fast and fail rarely. SecureFix delivers sourcing, desk-ready setup, repair cover and secure refresh for London businesses that want IT outcomes without building a large internal bench.',
    ceoOutcomes: [
      { title: 'Productive starters', text: 'Configured laptops reduce day-one downtime for new hires and contractors.' },
      { title: 'Controlled spend', text: 'Role-based specs stop overbuying while protecting critical roles.' },
      { title: 'Continuity', text: 'Repair and swap options keep projects moving when hardware fails.' },
    ],
    faqs: [
      {
        question: 'Can SecureFix act as our hardware lifecycle partner?',
        answer: 'Yes — from procurement through deployment, repair and recycling for London offices.',
      },
      {
        question: 'Do you work with existing MSPs?',
        answer: 'Often. We can own the device lifecycle while your MSP retains network or cloud responsibilities.',
      },
      {
        question: 'What size companies do you support?',
        answer: 'Growing SMEs through multi-team corporate offices that need practical London workshop speed.',
      },
    ],
  },
  'schools-education': {
    executiveSummary:
      'Schools and education teams need durable devices, safeguarding-aware setup and fast repair turnaround between lessons. SecureFix supports education estates with sourcing, imaging, classroom-ready configuration and reliable fix cycles.',
    ceoOutcomes: [
      { title: 'Less lesson disruption', text: 'Quicker screen and battery repairs keep teaching devices in circulation.' },
      { title: 'Standard classroom kits', text: 'Consistent images and accounts simplify technician and teacher support.' },
      { title: 'Budget stretch', text: 'Right-sized procurement and refresh planning protect limited education budgets.' },
    ],
    faqs: [
      {
        question: 'Can you image shared classroom laptops?',
        answer: 'Yes. We prepare shared and staff devices with agreed baselines before term starts or mid-year top-ups.',
      },
      {
        question: 'Do you collect from school sites?',
        answer: 'London collection and return options are available for batches of devices.',
      },
      {
        question: 'Can old student devices be wiped securely?',
        answer: 'Yes — secure wipe and recycling pathways help when kits are retired.',
      },
    ],
  },
  'cafes-restaurants': {
    executiveSummary:
      'Cafés and restaurants lose sales when EPOS tablets, kitchen displays, card terminals or back-office laptops fail mid-service. SecureFix keeps hospitality devices sourced, secured and repaired with the urgency front-of-house demands across London.',
    ceoOutcomes: [
      { title: 'Service continuity', text: 'Fast repair and swap options reduce downtime during peak trading.' },
      { title: 'Tough-device choices', text: 'We help select tablets and laptops that survive busy kitchens and counters.' },
      { title: 'Simple multi-site kits', text: 'Standard builds for managers across branches cut training and support noise.' },
    ],
    faqs: [
      {
        question: 'Can you support POS tablets as well as office laptops?',
        answer: 'Yes. Hospitality fleets often mix Android/iPadOS tablets with Windows management laptops.',
      },
      {
        question: 'Do you offer urgent same-day fixes?',
        answer: 'Where parts allow, same-day workshop or call-out options are available across London.',
      },
      {
        question: 'Can devices be ready before a new site opens?',
        answer: 'Yes — we can stage opening kits so managers walk into a configured stack on day one.',
      },
    ],
  },
  'construction-sites': {
    executiveSummary:
      'Construction leaders need rugged, practical IT from cabin to site. SecureFix sources field-ready devices, keeps them repaired, and supports refresh when dust, drops and weather shorten hardware life.',
    ceoOutcomes: [
      { title: 'Field resilience', text: 'Specs and cases matched to site conditions, not just office spreadsheets.' },
      { title: 'Less project delay', text: 'Broken site laptops and phones get a clear repair path instead of informal replacements.' },
      { title: 'Asset control', text: 'Tagging and lifecycle tracking help when gear moves between sites and subcontractors.' },
    ],
    faqs: [
      {
        question: 'Do you supply ruggedised options?',
        answer: 'We can recommend tougher devices and protective kits based on site risk and budget.',
      },
      {
        question: 'Can you turn around repairs between shifts?',
        answer: 'Priority workshop slots and collection routes are available for London projects.',
      },
      {
        question: 'How do you handle mixed contractor devices?',
        answer: 'We focus on company-owned fleets with clear asset records; BYOD advice is available where needed.',
      },
    ],
  },
  'law-firms-solicitors': {
    executiveSummary:
      'Law firms need confidential, reliable devices with clean onboarding and defensible disposal — the same pressures specialist legal IT partners emphasise around client matters, document systems and cyber standards. SecureFix provides discreet sourcing, secure configuration, repair cover and certified recycling suited to professional-services risk in London.',
    ceoOutcomes: [
      { title: 'Client confidentiality', text: 'Encryption and secure wipe practices support privilege and GDPR expectations.' },
      { title: 'Partner productivity', text: 'Desk-ready laptops and fast repair reduce billable-hour leakage from IT friction.' },
      { title: 'Matter continuity', text: 'Swap options keep fee-earners working when hardware fails mid-deadline.' },
    ],
    faqs: [
      {
        question: 'Can devices be configured for Microsoft 365 and document systems?',
        answer: 'Yes. We prepare accounts, security baselines and core productivity apps as agreed with your IT lead.',
      },
      {
        question: 'Do you provide certificates when retiring laptops?',
        answer: 'Secure recycling with documentation is available for audit and client due-diligence packs.',
      },
      {
        question: 'Is collection discreet for chambers or offices?',
        answer: 'London collection and return can be scheduled to minimise disruption in client-facing environments.',
      },
    ],
  },
  'care-homes': {
    executiveSummary:
      'Care homes and healthcare-adjacent sites need dependable devices for rostering, digital care planning, medication admin and family communication — systems that must keep running through night shifts. SecureFix supports care operators with practical procurement, setup, repair and secure disposal across London homes.',
    ceoOutcomes: [
      { title: 'Clinical ops continuity', text: 'Fewer outages on the devices staff use for care planning and handovers.' },
      { title: 'Multi-home standards', text: 'Repeatable builds for managers and nurses across a care group.' },
      { title: 'Data-safe retirement', text: 'Wiped disposal when homes refresh tablets and nursing-station PCs.' },
    ],
    faqs: [
      {
        question: 'Can you support tablets used on the floor as well as office PCs?',
        answer: 'Yes. Mixed tablet and laptop fleets are common in care environments.',
      },
      {
        question: 'Do you offer multi-site collection?',
        answer: 'London routes can cover groups of homes with batch repair and redeployment.',
      },
      {
        question: 'How do you reduce infection-control handling risk?',
        answer: 'We coordinate sealed collection, workshop repair and return so devices spend less time in uncontrolled transit.',
      },
    ],
  },
  'hotels-hostels': {
    executiveSummary:
      'Hotels and hostels need guest-facing and back-office IT that stays online through check-in peaks. SecureFix keeps property devices sourced, configured and repaired so operations and guest experience do not stall.',
    ceoOutcomes: [
      { title: 'Front-desk uptime', text: 'Priority fixes for PMS terminals, tablets and manager laptops.' },
      { title: 'Brand-standard kits', text: 'Consistent device builds across properties in a group.' },
      { title: 'Quiet operations', text: 'Scheduled collection avoids guest-area disruption.' },
    ],
    faqs: [
      {
        question: 'Can you prepare devices before a property launch?',
        answer: 'Yes — opening packs can be staged and delivered ready for training week.',
      },
      {
        question: 'Do you support both guest-ops and admin fleets?',
        answer: 'Yes. We cover operational tablets and back-office laptops under one lifecycle partner.',
      },
      {
        question: 'What about urgent weekend failures?',
        answer: 'Where parts and staffing allow, we prioritise hospitality outages that block check-in or payments.',
      },
    ],
  },
  airports: {
    executiveSummary:
      'Airport and airside-adjacent teams need resilient devices in high-pressure, high-compliance environments. SecureFix supports London operators with durable sourcing, rapid repair pathways and controlled lifecycle tracking.',
    ceoOutcomes: [
      { title: 'Operational resilience', text: 'Faster recovery when handhelds or laptops fail on shift.' },
      { title: 'Asset accountability', text: 'Clear tagging and refresh records for audited environments.' },
      { title: 'Secure retirement', text: 'Controlled wipe when devices leave airside or contractor use.' },
    ],
    faqs: [
      {
        question: 'Can you work to restricted site access windows?',
        answer: 'We plan collection and delivery around your permit and shift constraints.',
      },
      {
        question: 'Do you stock common spare parts for priority models?',
        answer: 'For agreed fleet standards we can plan parts readiness to shorten downtime.',
      },
      {
        question: 'Is documentation available for security teams?',
        answer: 'Asset and recycling documentation can be packaged for internal security and compliance stakeholders.',
      },
    ],
  },
  offices: {
    executiveSummary:
      'Modern offices need standardised laptops, smooth hybrid setup and a repair partner that keeps desks productive. SecureFix delivers office IT hardware lifecycle — buy, configure, support and recycle — for London workplaces.',
    ceoOutcomes: [
      { title: 'Hybrid-ready setups', text: 'VPN, collaboration apps and peripherals considered in every build.' },
      { title: 'Facilities alignment', text: 'Desk-side delivery coordinated with office moves and refreshes.' },
      { title: 'Lower noise for leadership', text: 'One vendor conversation for sourcing and break-fix repair.' },
    ],
    faqs: [
      {
        question: 'Can you kit out a new office floor?',
        answer: 'Yes — procurement plus staged deployment for managers, hot desks and meeting rooms.',
      },
      {
        question: 'Do you handle monitor and dock accessories?',
        answer: 'Accessory bundles can be included with laptop orders for consistent desk setups.',
      },
      {
        question: 'What happens to old office laptops?',
        answer: 'We can wipe, recycle or prepare trade-in pathways as part of the refresh.',
      },
    ],
  },
}

export function getBusinessServiceSeo(slug?: string | null) {
  if (!slug) return undefined
  return businessServiceSeo[slug]
}

export function getIndustrySolutionSeo(slug?: string | null) {
  if (!slug) return undefined
  return industrySolutionSeo[slug]
}
