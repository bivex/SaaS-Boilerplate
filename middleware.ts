/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T15:44:18
 * Last Updated: 2025-12-24T15:48:41
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import createMiddleware from 'next-intl/middleware';
import { AppConfig } from './src/utils/AppConfig';

export default createMiddleware({
  // A list of all locales that are supported
  locales: AppConfig.locales.map(locale => locale.id),

  // Used when no locale matches
  defaultLocale: AppConfig.defaultLocale,

  // Locale prefix strategy
  localePrefix: AppConfig.localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|en|ru|uk)/:path*'],
};
