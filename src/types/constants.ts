/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T03:40:00
 * Last Updated: 2025-12-24T03:40:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { EnumValues } from './Enum';

export const PLAN_ID = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export const BILLING_INTERVAL = {
  MONTH: 'month',
  YEAR: 'year',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
} as const;

export type PlanId = EnumValues<typeof PLAN_ID>;
export type BillingInterval = EnumValues<typeof BILLING_INTERVAL>;
