/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['ethers', 'openai', '@whiskeysockets/baileys', 'ws', 'pino'],
  },
}

export default nextConfig
