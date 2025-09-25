/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cama.it',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
