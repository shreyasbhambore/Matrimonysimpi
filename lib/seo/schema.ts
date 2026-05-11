export function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Namdevsimpi Matrimony',
    description: 'Trusted premium community matrimony platform for meaningful connections',
    url: 'https://namdevsipi matrimony.com',
    logo: 'https://namdevsipi matrimony.com/logo.png',
    sameAs: [
      'https://www.facebook.com/namdevsipimatrimony',
      'https://www.instagram.com/namdevsipimatrimony',
      'https://twitter.com/namdevsipimatrimony',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXX-XXXX-XXXX',
      contactType: 'Customer Support',
      email: 'support@namdevsipimatrimony.com',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Karnataka',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560000',
      addressCountry: 'IN',
    },
  }
}

export function generateLocalBusinessSchema(city: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Namdevsimpi Matrimony - ${city}`,
    description: `Premium matrimony services in ${city}`,
    areaServed: city,
    serviceType: 'Matrimony',
    url: `https://namdevsipi matrimony.com/matches?city=${city}`,
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
