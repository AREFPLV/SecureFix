import { site } from '@/data/content'

export const callOutSeo = {
  title: 'On-Site Call-Out Repair & IT Support in London | SecureFix',
  description:
    'Book a SecureFix London call-out for home or office. We come to you for on-site repair and IT support, or collect your device and return it the same day. London postcodes only.',
  path: '/call-out',
  keywords:
    'call out repair London, on-site IT support London, home visit phone repair, business call out technician, same day collection return London, SecureFix',
  image: '/images/onsite-banner.png',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'SecureFix On-Site Call-Out Repair & IT Support',
    serviceType: 'On-site device repair and IT support call-out',
    provider: {
      '@type': 'LocalBusiness',
      name: site.name,
      telephone: site.phone,
      email: site.email,
      url: `https://${site.website}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '218 City Road',
        addressLocality: 'London',
        postalCode: 'EC1V 2PN',
        addressCountry: 'GB',
      },
      areaServed: {
        '@type': 'City',
        name: 'London',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'London',
    },
    description:
      'Book a SecureFix London call-out for home or office. On-site repair and IT support, or same-day collection and return.',
    url: `https://${site.website}/call-out`,
  },
}

export const callOutContent = {
  heroTitle: 'On-Site Call-Out',
  heroAccent: 'London',
  heroSubtitle:
    'We come to your home or office for repair and IT support. Book a London call-out online in minutes.',
  intro: [
    `SecureFix provides on-site call-out repair and IT support across London. Whether you need a technician at your home, office or business premises, we come to you, diagnose the problem and get you working again.`,
    `Prefer not to wait on site? We can also collect your device, repair it in our workshop and return it the same day wherever possible.`,
    `Call-out bookings are available for London postcodes only. Enter your details below and our team will confirm your visit.`,
  ],
  services: [
    {
      icon: '🏠',
      title: 'Home Call-Out',
      text: 'Phone, laptop, tablet and console repairs at your door. Ideal if you cannot visit our City Road store.',
    },
    {
      icon: '🏢',
      title: 'Office & Business Call-Out',
      text: 'On-site IT support for small and large businesses: staff devices, printers, networking basics and urgent fixes.',
    },
    {
      icon: '🚚',
      title: 'Collection & Same-Day Return',
      text: 'We collect your device, repair it and bring it back the same day when parts and capacity allow.',
    },
    {
      icon: '⚡',
      title: 'Fast Response',
      text: 'Tell us your preferred time. We aim for a quick confirmation and a clear visit window across London.',
    },
  ],
  howItWorks: [
    {
      step: '1',
      title: 'Book online',
      text: 'Share your name, contact details, London address and a short note about the issue.',
    },
    {
      step: '2',
      title: 'We confirm',
      text: 'SecureFix contacts you to confirm timing, location and what we need to bring or collect.',
    },
    {
      step: '3',
      title: 'We come to you',
      text: 'A technician visits for on-site repair or IT support, or collects the device for workshop repair.',
    },
    {
      step: '4',
      title: 'Same-day where possible',
      text: 'Many jobs are completed or returned the same day, depending on the fault and parts available.',
    },
  ],
  coverage:
    'Call-out cover is limited to London postcodes (including central and Greater London areas such as E, EC, N, NW, SE, SW, W, WC, and surrounding London prefixes). Outside London, please use our drop-off or mail-in repair options.',
  faqs: [
    {
      question: 'What is included in a SecureFix call-out?',
      answer:
        'A call-out covers a home or business visit for device repair or IT support in London. We can work on site or collect the device for workshop repair and return.',
    },
    {
      question: 'Do you only cover London?',
      answer:
        'Yes. Online call-out booking only accepts London postcodes. If you are outside London, book a standard repair for drop-off or mail-in instead.',
    },
    {
      question: 'Can you collect and return the same day?',
      answer:
        'Yes, where capacity and parts allow. Mention collection & return in your notes and we will confirm what is possible when we contact you.',
    },
    {
      question: 'What devices do you support on a call-out?',
      answer:
        'Smartphones, tablets, laptops, PCs, gaming consoles, printers and related IT equipment for homes and businesses.',
    },
    {
      question: 'How do I book?',
      answer: `Fill in the call-out form on this page with your details and London postcode. You can also call ${site.phone} or WhatsApp ${site.whatsappPhone}.`,
    },
  ],
}

export function callOutJsonLd() {
  return callOutSeo.jsonLd
}
