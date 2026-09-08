import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import SnackbarProvider from "@/components/SnackbarProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["500", "700"],
  preload: true,
});

const siteUrl = "https://aqua-sentinel-two.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AquaSentinel - Monitoreo de Ríos",
    template: "%s | AquaSentinel",
  },
  description:
    "Sistema de vigilancia de ríos que alerta a tiempo sobre contaminación por mercurio y minería ilegal, para cuidar la salud de las personas y la Amazonía.",
  applicationName: "AquaSentinel",
  authors: [{ name: "AquaSentinel" }],
  creator: "AquaSentinel",
  keywords: [
    "monitoreo de ríos",
    "mercurio",
    "Amazonía",
    "Madre de Dios",
    "calidad del agua",
    "minería ilegal",
    "AquaSentinel",
  ],
  icons: {
    icon: [
      { url: "/favicon.webp", sizes: "32x32", type: "image/webp" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.webp", sizes: "192x192", type: "image/webp" }],
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteUrl,
    siteName: "AquaSentinel",
    title: "AquaSentinel - Monitoreo de Ríos",
    description:
      "Vigilancia de ríos y alertas por mercurio para proteger la salud pública y la Amazonía.",
    images: [{ url: "/icon-512.webp", width: 512, height: 512, alt: "AquaSentinel" }],
  },
  twitter: {
    card: "summary",
    title: "AquaSentinel - Monitoreo de Ríos",
    description:
      "Vigilancia de ríos y alertas por mercurio para proteger la salud pública y la Amazonía.",
    images: ["/icon-512.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#0077B6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AquaSentinel",
  url: siteUrl,
  description:
    "Sistema de vigilancia de ríos que alerta sobre contaminación por mercurio y minería ilegal en la Amazonía.",
  applicationCategory: "EnvironmentalApplication",
  operatingSystem: "Web",
  inLanguage: "es",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "PEN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
