/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
}

module.exports = nextConfig
