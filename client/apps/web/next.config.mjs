/** @type {import('next').NextConfig} */
const nextConfig = {
  // Already doing linting and typechecking as separate tasks in CI
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        hostname: "api.dicebear.com",
      },
    ],
  },
  // devIndicators: false,
};

export default nextConfig;
