/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T05:30:00
 * Last Updated: 2025-12-24T05:30:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TRPCProvider } from '@/trpc/provider';
import '@/styles/global.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://saas-boilerplate.com'),
  alternates: {
    canonical: '/',
  },
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
  // Basic structured data
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'SaaS Boilerplate',
      'description': 'Modern SaaS boilerplate built with Next.js, TypeScript, and Tailwind CSS',
      'url': 'https://saas-boilerplate.com',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'author': {
        '@type': 'Person',
        'name': 'Bivex',
        'url': 'https://github.com/bivex',
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The `suppressHydrationWarning` in <html> is used to prevent hydration errors caused by `next-themes`.
  // Solution provided by the package itself: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app

  // The `suppressHydrationWarning` attribute in <body> is used to prevent hydration errors caused by Sentry Overlay,
  // which dynamically adds a `style` attribute to the body tag.
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Preconnect to essential external domains (max 4 for best practices) */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />

        {/* Preload critical resources to eliminate render blocking */}
        <link rel="preload" href="/favicon.ico" as="image" />
        <link rel="preload" href="/apple-touch-icon.png" as="image" />

        {/* Performance hints */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />

        {/* Accessibility improvements */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Skip link for accessibility */}
        <style>
          {`
            .skip-link {
              position: absolute;
              top: -40px;
              left: 6px;
              background: hsl(var(--primary));
              color: hsl(var(--primary-foreground));
              padding: 8px;
              text-decoration: none;
              border-radius: 4px;
              z-index: 1000;
              font-weight: 600;
            }
            .skip-link:focus {
              top: 6px;
            }
            /* Focus indicators for better accessibility */
            *:focus-visible {
              outline: 2px solid hsl(var(--ring));
              outline-offset: 2px;
            }
            /* Ensure minimum touch target sizes */
            button, [role="button"], input, select, textarea {
              min-height: 44px;
              min-width: 44px;
            }
          `}
        </style>

        {/* Preload critical CSS for better LCP */}
        <link rel="modulepreload" href="/_next/static/css/app/layout.css" />
        <link rel="modulepreload" href="/_next/static/css/app/[locale]/page.css" />

        {/* Preload and optimize critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          />
        </noscript>

        {/* Font optimization: prevent invisible text during font load */}
        <style>
          {`
            /* Fallback font stack for better LCP */
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            /* Show fallback fonts immediately, swap to Inter when loaded */
            .font-inter {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              font-display: swap;
            }

            /* Critical CSS for Hero - prevent layout shifts */
            .hero-critical {
              min-height: 80vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 2rem;
            }

            .hero-title {
              font-size: 2.5rem;
              font-weight: 700;
              line-height: 1.1;
              text-align: center;
              margin: 1rem 0;
              max-width: 800px;
            }

            @media (min-width: 640px) {
              .hero-title {
                font-size: 3rem;
              }
            }

            .hero-description {
              font-size: 1.25rem;
              color: hsl(215.4 16.3% 46.9%);
              text-align: center;
              max-width: 768px;
              margin: 1.25rem auto;
              line-height: 1.6;
            }
          `}
        </style>
      </head>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        {/* Skip link for screen readers */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* PRO: Dark mode support for Shadcn UI */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
