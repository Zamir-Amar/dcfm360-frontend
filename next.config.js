/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3000'}/:path*`
      },
      {
        source: '/iot/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:3000'}/iot/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
