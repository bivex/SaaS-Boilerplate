/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T16:40:00
 * Last Updated: 2025-12-24T16:40:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'fr', 'ru', 'uk'];
export const defaultLocale = 'en';
export const localePrefix = 'always';

// Using internationalization in Server Components
export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  const locale = (await requestLocale) ?? 'en';
  if (!locales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./src/locales/${locale}.json`)).default,
  };
});
