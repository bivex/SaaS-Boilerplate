/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T17:07:03
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { LocalePrefix } from 'next-intl/routing';

import type { PricingPlan } from '@/types/Subscription';
import { BILLING_INTERVAL } from '@/types/Subscription';

const localePrefix = 'as-needed' as LocalePrefix;

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'SaaS Template',
  locales: [
    {
      id: 'en',
      name: 'English',
    },
    { id: 'fr', name: 'Français' },
    { id: 'ru', name: 'Русский' },
    { id: 'uk', name: 'Українська' },
  ],
  defaultLocale: 'en',
  localePrefix,
};

export const AllLocales = AppConfig.locales.map(locale => locale.id);

export const PLAN_ID = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const PricingPlanList: Record<string, PricingPlan> = {
  [PLAN_ID.FREE]: {
    id: PLAN_ID.FREE,
    price: 0,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: '',
    devPriceId: '',
    prodPriceId: '',
    features: {
      teamMember: 2,
      website: 2,
      storage: 2,
      transfer: 2,
    },
  },
  [PLAN_ID.PREMIUM]: {
    id: PLAN_ID.PREMIUM,
    price: 79,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_premium_test', // Use for testing
    // FIXME: Update the price ID, you can create it after running `npm run stripe:setup-price`
    devPriceId: 'price_1PNksvKOp3DEwzQlGOXO7YBK',
    prodPriceId: '',
    features: {
      teamMember: 5,
      website: 5,
      storage: 5,
      transfer: 5,
    },
  },
  [PLAN_ID.ENTERPRISE]: {
    id: PLAN_ID.ENTERPRISE,
    price: 199,
    interval: BILLING_INTERVAL.MONTH,
    testPriceId: 'price_enterprise_test', // Use for testing
    // FIXME: Update the price ID, you can create it after running `npm run stripe:setup-price`
    devPriceId: 'price_1PNksvKOp3DEwzQli9IvXzgb',
    prodPriceId: 'price_123',
    features: {
      teamMember: 100,
      website: 100,
      storage: 100,
      transfer: 100,
    },
  },
};
