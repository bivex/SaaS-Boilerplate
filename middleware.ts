/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:42:00
 * Last Updated: 2025-12-23T19:53:54
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { AllLocales, AppConfig } from './src/utils/AppConfig';

const intlMiddleware = createIntlMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

// Create a combined middleware that handles both i18n and auth
export default async function middleware(request: NextRequest) {
  // First handle internationalization
  const intlResponse = intlMiddleware(request);

  // If intl middleware wants to redirect, return that response
  if (intlResponse && intlResponse.status !== 200 && intlResponse.headers.has('location')) {
    return intlResponse;
  }

  // Then handle authentication with WorkOS AuthKit
  return authkitMiddleware({
    middlewareAuth: {
      enabled: true,
      unauthenticatedPaths: [
        '/',           // Root page
        '/en',         // English locale pages
        '/fr',         // French locale pages
        '/ru',         // Russian locale pages
        '/uk',         // Ukrainian locale pages
        '/sign-in',    // Sign in pages
        '/sign-up',    // Sign up pages
        '/login',      // Login redirect
        '/callback',   // Auth callback
        '/demo',       // Demo pages
        '/demo/**',    // All demo subpages
      ],
    },
  })(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
