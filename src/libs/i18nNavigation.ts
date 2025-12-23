/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T19:01:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { createNavigation } from 'next-intl/navigation';

import { AllLocales, AppConfig } from '@/utils/AppConfig';

export const { usePathname, useRouter } = createNavigation({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});
