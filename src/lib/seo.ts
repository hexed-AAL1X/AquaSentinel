export const siteUrl = 'https://aqua-sentinel-two.vercel.app';

export const siteName = 'AquaSentinel';

export const defaultTitle = 'AquaSentinel';

export const defaultDescription =
  'AquaSentinel vigila la calidad del agua y detecta mercurio por minería ilegal en ríos de Madre de Dios y la Amazonía peruana. Alertas en tiempo real para proteger la salud pública.';

export const keywords = [
  'monitoreo de ríos',
  'mercurio en ríos',
  'calidad del agua Madre de Dios',
  'contaminación por minería ilegal',
  'monitoreo ambiental Amazonía',
  'detección de mercurio Perú',
  'sensores de agua Puerto Maldonado',
  'AquaSentinel',
  'vigilancia hídrica',
  'alertas contaminación ríos',
];

export const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/icon-512.webp`,
      email: 'contacto@aquasentinel.com',
      description: defaultDescription,
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Madre de Dios, Perú',
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: defaultDescription,
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'es-PE',
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#app`,
      name: siteName,
      url: siteUrl,
      applicationCategory: 'EnvironmentalApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-PE',
      description: defaultDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'PEN',
      },
      provider: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'Place',
      '@id': `${siteUrl}/#place`,
      name: 'Puerto Maldonado, Madre de Dios',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Puerto Maldonado',
        addressRegion: 'Madre de Dios',
        addressCountry: 'PE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -12.5934,
        longitude: -69.1892,
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué es AquaSentinel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AquaSentinel es un sistema de monitoreo ambiental que vigila la calidad del agua en ríos de Madre de Dios y detecta contaminación por mercurio asociada a la minería ilegal.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Dónde opera AquaSentinel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Opera principalmente en Puerto Maldonado y la cuenca de Madre de Dios, en la Amazonía peruana, con sensores en ríos como Madre de Dios y Tambopata.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cómo ayuda a la salud pública?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Envía alertas tempranas cuando los niveles de mercurio u otros parámetros del agua superan umbrales seguros, para que instituciones y comunidades puedan actuar a tiempo.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué parámetros mide?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Mide mercurio, pH, temperatura, turbidez y otros indicadores de calidad del agua mediante sensores conectados en tiempo casi real.',
          },
        },
      ],
    },
  ],
};
