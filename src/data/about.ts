export type FaqItem = {
  question: string
  answer: string
}

export const aboutContent = {
  whoWeAre: {
    title: 'Who We Are',
    paragraphs: [
      'SecureFix is the trading name of SECUREFIX LTD, a device repair shop at 218 City Road, London EC1V 2PN. We fix phones, tablets, laptops, gaming consoles and smart watches, using genuine and premium-quality parts.',
      'Our mission is simple: your phone, your data, secured and fixed. We treat every device as if it were our own, with same-day service where the repair time allows, and transparent pricing.',
    ],
  },
  whatWeDo: {
    title: 'What We Do',
    items: [
      {
        icon: '🔧',
        title: 'Expert Repairs',
        description: 'Screen replacements, battery swaps, charging port fixes, board-level repairs and more, often completed the same day.',
      },
      {
        icon: '📱',
        title: 'Buy, Sell & Trade-In',
        description: 'We buy and sell new and refurbished devices. Get an instant quote and trade in your old phone, tablet or console.',
      },
      {
        icon: '🛡️',
        title: 'Protection & Accessories',
        description: 'Premium cases, screen protectors, chargers and cables to keep your devices safe after repair.',
      },
      {
        icon: '🚚',
        title: 'Free Collection & Return',
        description: 'Can\'t visit us? We offer free collection and return across London. We collect, repair and deliver back to you.',
      },
      {
        icon: '💾',
        title: 'Data Recovery',
        description: '100% confidential data recovery from damaged phones, laptops and storage devices.',
      },
      {
        icon: '🏢',
        title: 'Business Services',
        description: 'Corporate repair plans and fleet device management for businesses across London.',
      },
    ],
  },
}

export const faqItems: FaqItem[] = [
  {
    question: 'How long does a repair take?',
    answer:
      'Most common repairs, such as screen replacements, battery swaps and charging port fixes, are completed within 45 minutes to 2 hours. More complex repairs like board-level work or data recovery may take longer. We offer same-day service on the majority of repairs in London.',
  },
  {
    question: 'Do you use genuine parts?',
    answer:
      'Yes. We use genuine OEM parts where available, and high-quality premium compatible parts for all other repairs. Every part is tested before and after installation to ensure your device performs like new.',
  },
  {
    question: 'What devices do you repair?',
    answer:
      'We repair smartphones (iPhone, Samsung, Google Pixel and more), tablets and iPads, laptops and MacBooks, gaming consoles (PS5, Xbox, Nintendo Switch), smart watches, iPods, printers and other devices. If you\'re unsure, contact us and we\'ll let you know.',
  },
  {
    question: 'Is my data safe during repair?',
    answer:
      'Absolutely. Your privacy and data security are our priority. We never access personal files unless required for diagnostics (with your permission). All data recovery services are 100% confidential.',
  },
  {
    question: 'How does free collection and return work?',
    answer:
      'If you\'re in London, we can collect your device from your address, repair it at our workshop, and return it to you, often the same day. Enter your postcode when booking to check if you\'re in our service area.',
  },
  {
    question: 'How much does a screen replacement cost?',
    answer:
      'Prices vary by device model. iPhone screen replacements start from around £79.99, with premium screens up to £199.99. You can get an exact price by using our online booking tool. Select your device and issue for an instant quote.',
  },
  {
    question: 'Do I need to book an appointment?',
    answer:
      'Walk-ins are welcome, but booking online or by phone guarantees your slot and speeds up the process. You can book a repair on our website in just a few minutes.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept card payments and cash in store. You can pay when you drop off or collect your device, or when our technician completes an on-site visit.',
  },
  {
    question: 'What is your warranty policy?',
    answer:
      'All repairs at SecureFix come with a 1-year warranty for your peace of mind. This covers defects related to the repair and parts we install. However, the warranty is void if the device suffers water damage, liquid damage, or physical damage (such as drops, cracks or impact) after the repair has been completed. The warranty also does not cover normal wear and tear or damage caused by misuse. If you have any issues within the warranty period, contact us and we\'ll be happy to help.',
  },
  {
    question: 'Can you repair water-damaged devices?',
    answer:
      'Yes, we offer liquid damage diagnostics and repair. Success depends on the severity and how quickly the device is brought in. We recommend turning off the device immediately and bringing it to us as soon as possible. Please note that water-damaged devices are not covered under our standard 1-year warranty.',
  },
]
