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

  // Reduce polyfills for modern browsers

  // Enable compression
  compress: true,

  // Optimize loading
  experimental: {
    // Skip transpilation of modern features for better browsers
    browsersListForSwc: true,
    // Faster builds with improved memory usage
    webpackBuildWorker: true,
    // Reduce bundle size by not polyfilling modern features
    esmExternals: 'loose',
    // Optimize CSS
    optimizeCss: true,
    // Defer non-critical scripts and optimize imports
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'framer-motion',
      'next-intl',
      'react-hook-form',
      'zod',
      'recharts',
      'superjson',
    ],
  },

  // Optimize chunks
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Framework chunk - highest priority
        framework: {
          test: /[\\/]node_modules[\\/](next|@next|react|react-dom)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 40,
          enforce: true,
        },
        // UI library chunk
        ui: {
          test: /[\\/]node_modules[\\/](@radix-ui|@tanstack|framer-motion|lucide-react)[\\/]/,
          name: 'ui',
          chunks: 'all',
          priority: 30,
          enforce: true,
        },
        // Authentication chunk
        auth: {
          test: /[\\/]node_modules[\\/](better-auth|@upstash)[\\/]/,
          name: 'auth',
          chunks: 'all',
          priority: 25,
        },
        // Other vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10,
        },
      };
    }

    // Additional optimizations
    if (!isServer) {
      // Enable more aggressive optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        mangleExports: 'deterministic',
        minimize: true,
      };

      // Reduce bundle size by removing development code
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-dev-runtime': 'react/jsx-runtime',
      };

      // Optimize performance
      config.performance = {
        hints: false, // Disable performance hints in development
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
