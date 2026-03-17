const withPWA = require('next-pwa')({
  dest: 'public'
});

module.exports = withPWA({
  /** @type {import('next').NextConfig} */
  output: 'export',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cf.geekdo-images.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'steamforged.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  turbopack: {},
});
