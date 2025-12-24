/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T20:53:17
 * Last Updated: 2025-12-23T21:57:09
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { fileURLToPath } from 'node:url';

import withBundleAnalyzer from '@next/bundle-analyzer';
import createJiti from 'jiti';
import withNextIntl from 'next-intl/plugin';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntlConfig = withNextIntl('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Performance optimizations
const nextConfig = {
  // Enable SWC minifier for faster builds
  swcMinify: true,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/sign-up',
        destination: '/en/sign-up',
        permanent: false,
      },
      {
        source: '/sign-in',
        destination: '/en/sign-in',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/en/dashboard',
        permanent: false,
      },
      // Add more common routes as needed
    ];
  },
};

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
  withNextIntlConfig({
    ...nextConfig,
    poweredByHeader: false,
    reactStrictMode: true,
    serverExternalPackages: ['@electric-sql/pglite'],
    // Performance optimizations
    experimental: {
      // Enable faster CSS processing
      optimizeCss: true,
      // Faster builds with improved memory usage
      webpackBuildWorker: true,
    },
    // Suppress middleware deprecation warning
    logging: {
      fetches: {
        fullUrl: process.env.NODE_ENV === 'development',
      },
    },
    // Enable build caching
    generateBuildId: async () => {
      return `build-cache-${Date.now()}`;
    },
  }),
);
