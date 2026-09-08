import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AquaSentinel',
    short_name: 'AquaSentinel',
    description:
      'Sistema de vigilancia de ríos y alertas por contaminación de mercurio en la Amazonía.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0077B6',
    theme_color: '#0077B6',
    lang: 'es',
    icons: [
      { src: '/icon-192.webp', sizes: '192x192', type: 'image/webp' },
      { src: '/icon-512.webp', sizes: '512x512', type: 'image/webp' },
    ],
  };
}
