export type TermsSection = {
  title: string
  paragraphs: string[]
}

export const termsContent = {
  lastUpdated: '15 September 2026',
  intro:
    'These Terms & Conditions set out the basis on which SecureFix LTD (“SecureFix”, “we”, “us” or “our”) provides repair, trade-in, accessories, recycling and related services. By booking a repair, using our website, or purchasing products or services from us, you agree to these terms.',
  sections: [
    {
      title: '1. Who we are',
      paragraphs: [
        'SECUREFIX LTD (company number 17175693) trades as SecureFix. The company is registered in England and Wales and was incorporated on 23 April 2026. The registered office and shop is 218 City Road, London EC1V 2PN. Phone 020 3336 7147. Email info@securefix.uk.',
        'These terms apply to customers in the United Kingdom. Nothing in these terms affects your statutory rights as a consumer under UK law.',
      ],
    },
    {
      title: '2. Services',
      paragraphs: [
        'We provide device repair services (including smartphones, tablets, laptops, gaming devices and other electronics), trade-in and buy/sell services, accessories, business IT support, and responsible device recycling where offered.',
        'Service availability, turnaround times and same-day options depend on the device, fault, parts availability and workshop capacity. Any estimated times given are guidance only and are not guaranteed.',
      ],
    },
    {
      title: '3. Bookings and quotes',
      paragraphs: [
        'Bookings can be made online, by phone, WhatsApp, email or in person. Submitting a booking request does not guarantee an appointment until we confirm it.',
        'Quotes are based on the information you provide and an initial assessment. The final price may change after diagnosis if additional work or parts are required. We will seek your approval before carrying out work that differs materially from the quoted scope or price.',
        'Diagnostic fees may apply in some cases. If charged, these will be explained before work begins.',
      ],
    },
    {
      title: '4. Customer responsibilities',
      paragraphs: [
        'You confirm that you own the device or have authority to request repair or related services on behalf of the owner.',
        'Please back up your data before leaving a device with us. While we take care of devices in our possession, we are not responsible for loss of data, settings, apps or media unless caused by our negligence and required by law.',
        'Please remove SIM cards, memory cards and accessories unless we ask you to leave them. Tell us about any passcodes, accounts or security locks needed to diagnose or test the device.',
      ],
    },
    {
      title: '5. Parts and repairs',
      paragraphs: [
        'We aim to use genuine or high-quality premium compatible parts suitable for the repair. Part type and availability can vary by device and model.',
        'If a repair cannot be completed (for example due to unavailable parts, irreversible damage, or manufacturer restrictions), we will explain the options. Any diagnostic or assessment fee previously agreed may still apply.',
        'Repairs may involve opening the device. Opening some devices can affect manufacturer or third-party cover. It is your responsibility to check any existing cover before authorising work.',
      ],
    },
    {
      title: '6. Repair warranty',
      paragraphs: [
        'All repairs at SecureFix come with a 2-year warranty. This covers defects related to the repair and the parts we install. Water damage and liquid damage are excluded. The warranty is also void if the device suffers physical damage, such as a drop, crack or impact, after the repair. It does not cover normal wear and tear or damage caused by misuse.',
      ],
    },
    {
      title: '7. Payment',
      paragraphs: [
        'Payment is due as agreed at booking or on collection/completion of the service, unless we agree otherwise in writing.',
        'Prices are in GBP and include VAT where applicable unless stated otherwise. We accept the payment methods offered at the time of sale.',
        'Devices may be retained until payment for completed authorised work has been received in full.',
      ],
    },
    {
      title: '8. Collection, drop-off and delivery',
      paragraphs: [
        'Where we offer collection or return delivery, availability and timing depend on location and scheduling. Additional fees may apply and will be confirmed in advance.',
        'You are responsible for providing accurate contact and address details. We are not responsible for delays or failed collections caused by incorrect information or someone unavailable at the agreed time.',
      ],
    },
    {
      title: '9. Uncollected devices',
      paragraphs: [
        'Please collect repaired or assessed devices promptly when notified. If a device remains uncollected for an unreasonable period after notice, we may charge reasonable storage fees and, where permitted by law, take further steps regarding the device after giving appropriate notice.',
      ],
    },
    {
      title: '10. Trade-in, recycling and accessories',
      paragraphs: [
        'Trade-in values and recycling quotes are estimates until the device has been inspected. Final offers may change if the condition differs from what was described.',
        'Accessories and products are sold subject to stock availability. Product descriptions on the website are provided in good faith.',
        'Where recycling includes data wiping or destruction, we will follow the process described at the time of booking. You remain responsible for removing personal accounts where required before handover.',
      ],
    },
    {
      title: '11. Website and online content',
      paragraphs: [
        'Website content is provided for general information. We may update services, prices and availability without notice.',
        'You must not misuse the website, attempt unauthorised access, or submit false or abusive booking or contact information.',
      ],
    },
    {
      title: '12. Liability',
      paragraphs: [
        'We will provide services with reasonable care and skill. Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be limited under UK law.',
        'Subject to the above, we are not liable for indirect or consequential loss, including loss of business, profit, opportunity or data, except where required by law.',
        'Our total liability for any claim arising from a repair or related service is limited to the amount paid for that service, except where the law requires otherwise.',
      ],
    },
    {
      title: '13. Privacy',
      paragraphs: [
        'We process personal information needed to provide our services (such as name, contact details and device information). We handle personal data in line with applicable UK data protection law.',
        'For privacy questions, contact us at info@securefix.uk. The privacy policy is published at /privacy.',
      ],
    },
    {
      title: '14. Changes to these terms',
      paragraphs: [
        'We may update these Terms & Conditions from time to time. The version published on this page applies to new bookings and purchases from the date it is posted. The “Last updated” date shows when this page was last revised.',
      ],
    },
    {
      title: '15. Governing law',
      paragraphs: [
        'These terms are governed by the laws of England and Wales. Courts of England and Wales have exclusive jurisdiction, except that consumers may also bring claims in their local courts where the law allows.',
      ],
    },
  ] satisfies TermsSection[],
}
