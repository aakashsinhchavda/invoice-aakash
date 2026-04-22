/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer', 'puppeteer-core', '@sparticuz/chromium'],
  // Satisfy Next.js 16 Turbopack requirement when using custom configs
  allowedDevOrigins: ['192.168.0.156', 'localhost:3000'],
  turbopack: {},
};

export default nextConfig;
