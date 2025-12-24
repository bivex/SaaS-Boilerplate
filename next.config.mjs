/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T20:53:17
 * Last Updated: 2025-12-24T06:49:52
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { fileURLToPath } from 'node:url';

import createJiti from 'jiti';
import createNextIntlPlugin from 'next-intl/plugin';
import withRspack from 'next-rspack';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntl = createNextIntlPlugin('./src/libs/i18n.ts');

// Full Rspack config with Next.js 16 optimizations
const config = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingRoot: fileURLToPath(import.meta.url).replace('/next.config.mjs', ''),

  // Image optimization
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

  // Compression
  compress: true,

  // Next.js 16 experimental features compatible with Rspack
  experimental: {
    optimizeCss: true,
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
      'react-day-picker',
      '@tanstack/react-query',
      '@tanstack/react-table',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
};

config = withNextIntl(config);

// Use Rspack only for builds, webpack for dev/start
if (process.argv.some(arg => arg.includes('build'))) {
  config = withRspack(config, {
    // Rspack-specific performance optimizations
    performance: {
      hints: 'warning',
      maxAssetSize: 300000, // Reduced to 300kb to force better splitting
      maxEntrypointSize: 300000,
    },

    // Enhanced bundle splitting to reduce unused JavaScript
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000, // Minimum 20kb per chunk
        maxSize: 200000, // Maximum 200kb per chunk to reduce unused code
        cacheGroups: {
          // Framework chunk - React, Next.js core
          framework: {
            test: /[\\/]node_modules[\\/](next|@next|react|react-dom)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Separate Radix UI components
          radix: {
            test: /[\\/]node_modules[\\/](@radix-ui)[\\/]/,
            name: 'radix-ui',
            chunks: 'all',
            priority: 35,
            reuseExistingChunk: true,
          },
          // UI libraries (icons, animations)
          uiLibs: {
            test: /[\\/]node_modules[\\/](lucide-react|framer-motion)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          // Data fetching libraries
          data: {
            test: /[\\/]node_modules[\\/](@tanstack)[\\/]/,
            name: 'data-libs',
            chunks: 'all',
            priority: 28,
            reuseExistingChunk: true,
          },
          // Authentication libraries
          auth: {
            test: /[\\/]node_modules[\\/](better-auth|@upstash)[\\/]/,
            name: 'auth',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Form libraries
          forms: {
            test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
            name: 'forms',
            chunks: 'all',
            priority: 22,
            reuseExistingChunk: true,
          },
          // Utility libraries
          utils: {
            test: /[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority|superjson)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Charts library (async loading)
          charts: {
            test: /[\\/]node_modules[\\/](recharts)[\\/]/,
            name: 'charts',
            chunks: 'async', // Load only when needed
            priority: 15,
            reuseExistingChunk: true,
          },
          // Remaining vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },

      // Aggressive minification and optimization
      minimize: true,
      minimizer: [], // Use Rspack's built-in minimizers

      // Deterministic chunk and module IDs for better caching
      chunkIds: 'deterministic',
      moduleIds: 'deterministic',

      // Enable more aggressive optimizations
      mangleExports: 'deterministic',
      concatenateModules: true,
      innerGraph: true,
      sideEffects: true,

      // Additional optimizations for unused code reduction
      usedExports: true, // Enable used exports analysis
      providedExports: true, // Enable provided exports analysis
      emitOnErrors: false, // Don't emit assets on errors
    },

    // Enhanced module resolution for better tree shaking
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        // Optimize React production builds
        'react/jsx-dev-runtime': 'react/jsx-runtime',
      },
      // Prefer ESM modules for better tree shaking
      mainFields: ['module', 'main'],
      // Enable module resolution for better tree shaking
      conditionNames: ['import', 'require', 'node'],
    },

    // Source maps for debugging and Lighthouse performance insights
    devtool: {
      type: 'source-map', // Generate separate source map files
    },

    // Production optimizations
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

    // Experimental Rspack features for better performance
    experiments: {
      rspackFuture: {
        bundlerInfo: {
          force: false,
        },
      },
    },

    // Build stats and profiling
    stats: {
      preset: 'minimal',
      modules: false,
      chunks: true,
      chunkModules: false,
      reasons: false,
      assets: true,
      entrypoints: false,
    },
  });
}

export default config;
