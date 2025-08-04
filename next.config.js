/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  trailingSlash: true, // Ensure URLs end with / for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Set base path for GitHub Pages (update 'trap-door-module' to your repo name)
  basePath: process.env.NODE_ENV === 'production' ? '/trap-door-module' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/trap-door-module/' : '',
  // Ensure proper UTF-8 encoding for emojis
  experimental: {
    esmExternals: false,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;