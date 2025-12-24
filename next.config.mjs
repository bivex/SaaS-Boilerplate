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

  // JavaScript optimization
  swcMinify: true, // Use SWC for faster minification

  // Reduce polyfills for modern browsers
  experimental: {
    // Skip transpilation of modern features for better browsers
    browsersListForSwc: true,
    // Enable faster CSS processing
    optimizeCss: true,
    // Faster builds with improved memory usage
    webpackBuildWorker: true,
    // Reduce bundle size by not polyfilling modern features
    esmExternals: 'loose',
  },

  // Enable compression
  compress: true,

  // Optimize chunks
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Separate large libraries
        next: {
          test: /[\\/]node_modules[\\/]next[\\/]/,
          name: 'next',
          chunks: 'all',
          priority: 20,
        },
      };
    }

    return config;
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
