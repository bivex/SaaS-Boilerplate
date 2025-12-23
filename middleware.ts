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

// Create combined middleware using authkitMiddleware's beforeAuth
export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      '/',           // Root page
      '/sign-in',    // Sign in pages
      '/sign-up',    // Sign up pages
      '/login',      // Login redirect
      '/callback',   // Auth callback
      '/demo',       // Demo pages
      '/demo/**',    // All demo subpages
    ],
  },
  // Handle i18n before auth
  beforeAuth: (request) => {
    const intlResponse = intlMiddleware(request);
    if (intlResponse && intlResponse.status !== 200 && intlResponse.headers.has('location')) {
      return intlResponse;
    }
    return undefined; // Continue with auth
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/'],
};
