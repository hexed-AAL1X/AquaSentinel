import type { Metadata, Viewport } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import SnackbarProvider from '@/components/SnackbarProvider';
import {
  defaultDescription,
  defaultTitle,
  jsonLdGraph,
  keywords,
  siteName,
  siteUrl,
} from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  weight: ['500', '700'],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s',
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: 'environment',
  keywords,
  icons: {
    icon: [
      { url: '/favicon.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.webp', sizes: '192x192', type: 'image/webp' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: siteUrl,
    siteName,
    title: 'AquaSentinel — Monitoreo de mercurio en ríos de Madre de Dios',
    description: defaultDescription,
    images: [
      {
        url: '/hero-lg.webp',
        width: 1400,
        height: 933,
        alt: 'Monitoreo de ríos amazónicos con AquaSentinel en Madre de Dios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaSentinel — Monitoreo de mercurio en ríos de Madre de Dios',
    description: defaultDescription,
    images: ['/hero-lg.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'es-PE': siteUrl,
      es: siteUrl,
    },
  },
  verification: {
    google: 'NRP35uE_2t1WdOHBnV6zo5rC8mHXd8ey38ov8za5Rgo',
  },
  other: {
    'geo.region': 'PE-MDD',
    'geo.placename': 'Puerto Maldonado',
    'geo.position': '-12.5934;-69.1892',
    ICBM: '-12.5934, -69.1892',
  },
};

export const viewport: Viewport = {
  themeColor: '#0077B6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PE" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className={inter.className}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
