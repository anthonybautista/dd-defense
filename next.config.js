/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dikdiks-api-anthonybautist2.replit.app',
        port: '',
        pathname: '/api/image/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/QmerHSeAHhZyL3veq5D1HLVWmgfEXbPmozH54uxmKwjAZ5/**',
      },
    ],
  },
};

module.exports = nextConfig;
