/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://aquasentinel.alwaysdata.net/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
