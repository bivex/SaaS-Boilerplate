/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:04:09
 * Last Updated: 2025-12-23T17:07:04
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { enUS, frFR } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

import { AppConfig } from '@/utils/AppConfig';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const [params, setParams] = useState<{ locale: string } | null>(null);

  useEffect(() => {
    props.params.then(setParams);
  }, [props.params]);

  if (!params) {
    return null; // or a loading spinner
  }

  const clerkLocale = params.locale === 'fr' ? frFR : enUS;
  const localePrefix = params.locale !== AppConfig.defaultLocale ? `/${params.locale}` : '';

  const signInUrl = `${localePrefix}/sign-in`;
  const signUpUrl = `${localePrefix}/sign-up`;
  const dashboardUrl = `${localePrefix}/dashboard`;
  const afterSignOutUrl = localePrefix || '/';

  return (
    <ClerkProvider
      // PRO: Dark mode support for Clerk
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={dashboardUrl}
      signUpFallbackRedirectUrl={dashboardUrl}
      afterSignOutUrl={afterSignOutUrl}
      appearance={{
        signUp: {
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-none',
          },
        },
      }}
    >
      {props.children}
    </ClerkProvider>
  );
}
