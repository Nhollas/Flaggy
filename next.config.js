/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    optimizePackageImports: ["@/app/components/ui", "@/app/features/flags"],
  },
}

module.exports = nextConfig
