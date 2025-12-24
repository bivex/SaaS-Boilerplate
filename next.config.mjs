/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T20:53:17
 * Last Updated: 2025-12-24T16:34:39
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { fileURLToPath } from 'node:url';

import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import createJiti from 'jiti';
import createNextIntlPlugin from 'next-intl/plugin';
import withRspack from 'next-rspack';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

// Full Rspack config with Next.js 16 optimizations
let config = {
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
  const rspackConfig = {
    // Ultra-aggressive performance limits for maximum optimization
    performance: {
      hints: false, // Disable hints since we're optimizing aggressively
      maxAssetSize: 150000, // Very aggressive 150kb limit to force more splitting
      maxEntrypointSize: 150000, // Very aggressive 150kb entry point limit
      // Additional performance optimizations
      assetFilter: (assetFilename) => {
        // Skip performance hints for certain assets
        return !/\.(?:map|gz|br)$/.test(assetFilename);
      },
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
          // SWC helpers - commonly duplicated
          swcHelpers: {
            test: /[\\/]node_modules[\\/]@swc[\\/]helpers[\\/]/,
            name: 'swc-helpers',
            chunks: 'all',
            priority: 50,
            minChunks: 1, // Allow single usage to prevent duplication
            enforce: true,
            reuseExistingChunk: true,
          },
          // Separate Radix UI components - ensure shared components are extracted
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            chunks: 'all',
            priority: 45,
            minChunks: 1, // Allow single usage to prevent duplication
            enforce: true, // Force creation of this chunk
            reuseExistingChunk: true,
          },
          // UI libraries (icons, animations)
          uiLibs: {
            test: /[\\/]node_modules[\\/](lucide-react|framer-motion)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 40,
            minChunks: 1, // Allow single usage to prevent duplication
            enforce: true,
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

      // Aggressive JavaScript minification with enhanced options
      minimize: true,
      minimizer: [], // Use Rspack's enhanced built-in minimizers

      // Deterministic chunk and module IDs for better caching
      chunkIds: 'deterministic',
      moduleIds: 'deterministic',

      // Aggressive optimizations for maximum minification
      mangleExports: 'size', // Mangle for size instead of deterministic
      concatenateModules: true,
      innerGraph: true,
      sideEffects: true,

      // Enhanced unused code reduction
      usedExports: true, // Enable used exports analysis
      providedExports: true, // Enable provided exports analysis
      emitOnErrors: false, // Don't emit assets on errors

      // Additional aggressive minification optimizations
      removeAvailableModules: true, // Remove modules that are available
      removeEmptyChunks: true, // Remove empty chunks
      mergeDuplicateChunks: true, // Merge duplicate chunks
      flagIncludedChunks: true, // Flag chunks that are included
    },

    // Optimized module resolution for better tree shaking
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
      // Optimize module resolution
      symlinks: false, // Improve build performance
      cacheWithContext: false, // Better caching for monorepos
    },

    // Source maps for debugging and Lighthouse performance insights
    devtool: {
      type: 'source-map', // Generate separate source map files
    },

    // Production mode for optimal minification
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

    // Stable Rspack features for reliable performance
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

  };

  config = withRspack(config, rspackConfig);
}

// Apply plugins conditionally
const finalConfig = (() => {
  if (process.argv.some(arg => arg.includes('build'))) {
    // For builds, use both next-intl and Rspack
    const configWithPlugins = withNextIntl(withRspack(config));

    // Add Rsdoctor for builds when RSDOCTOR env is set
    if (process.env.RSDOCTOR) {
      // Rsdoctor is applied through webpack config for Next.js + Rspack
      configWithPlugins.webpack = (config, { isServer }) => {
        if (!isServer) { // Client-side builds only
          config.plugins.push(
            new RsdoctorRspackPlugin({
              disableClientServer: true,
              features: ['bundle'], // Only analyze bundle, not loader
            }),
          );
        }
        return config;
      };
    }
    return configWithPlugins;
  } else {
    // For dev/start, use only next-intl
    return withNextIntl(config);
  }
})();

export default finalConfig;
