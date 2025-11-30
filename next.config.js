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
        destination: 'http://aquasentinel.brazilsouth.cloudapp.azure.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
