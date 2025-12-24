/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-24T01:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import * as React from 'react';
import { LocaleSwitcher, SessionRefresher } from '@/components/LocaleSwitcher';

import { ThemeProvider } from '@/components/ThemeProvider';
import { TRPCProvider } from '@/trpc/provider';
import { AllLocales } from '@/utils/AppConfig';
import '@/styles/global.css';

export const metadata: Metadata = {
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
};

export function generateStaticParams() {
  return AllLocales.map(locale => ({ locale }));
}

export default async function RootLayout(props: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const params = await props.params;
  setRequestLocale(params.locale);

  // Using internationalization in Client Components
  const messages = await getMessages();

  // The `suppressHydrationWarning` in <html> is used to prevent hydration errors caused by `next-themes`.
  // Solution provided by the package itself: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app

  // The `suppressHydrationWarning` attribute in <body> is used to prevent hydration errors caused by Sentry Overlay,
  // which dynamically adds a `style` attribute to the body tag.
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        {/* Preconnect to essential external domains (max 4 for best practices) */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preload critical resources to eliminate render blocking */}
        <link rel="preload" href="/favicon.ico" as="image" />
        <link rel="preload" href="/apple-touch-icon.png" as="image" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          as="style"
        />
      </head>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        {/* PRO: Dark mode support for Shadcn UI */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            <NextIntlClientProvider
              locale={params.locale}
              messages={messages}
            >
              <SessionRefresher />
              <main>
                {props.children}
              </main>
              <div className="fixed bottom-4 right-4 z-50">
                <LocaleSwitcher />
              </div>
            </NextIntlClientProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
