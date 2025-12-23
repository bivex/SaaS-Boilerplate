/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T22:27:10
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { AllLocales, AppConfig } from './src/utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const isProtectedRoute = (pathname: string) => {
  return (
    pathname.includes('/dashboard')
    || pathname.includes('/onboarding')
    // API routes are now allowed through (auth routes handle their own auth)
  );
};

const isAuthPage = (pathname: string) => {
  return pathname.includes('/sign-in') || pathname.includes('/sign-up');
};

export default function proxy(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (sessionCookie && isAuthPage(pathname)) {
    const locale = pathname.match(/(\/.*)\/sign-in/)?.at(1)
      ?? pathname.match(/(\/.*)\/sign-up/)?.at(1) ?? '';
    const dashboardUrl = new URL(`${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If user is not authenticated and trying to access protected routes, redirect to sign-in
  if (!sessionCookie && isProtectedRoute(pathname)) {
    const locale = pathname.match(/(\/.*)\/dashboard/)?.at(1)
      ?? pathname.match(/(\/.*)\/onboarding/)?.at(1) ?? '';
    const signInUrl = new URL(`${locale}/sign-in`, request.url);
    return NextResponse.redirect(signInUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'], // Also exclude tunnelRoute used in Sentry from the matcher
};
