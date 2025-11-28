import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import SnackbarProvider from "@/components/SnackbarProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AquaSentinel - Monitoreo de Ríos",
  description: "Sistema de monitoreo de calidad de agua y detección de mercurio en ríos",
  icons: {
    icon: '/icon.png',
  },
  other: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${orbitron.variable}`}>
      <body className={inter.className}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
