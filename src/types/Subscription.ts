/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-24T01:03:42
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { BillingInterval, PlanId } from './constants';

// PricingPlan is currently only used for Pricing section of the landing page.
// If you need a real Stripe subscription payment with checkout page, customer portal, webhook, etc.
// You can check out the Next.js Boilerplate Pro at: https://nextjs-boilerplate.com/pro-saas-starter-kit
// On top of that, you'll get access to real example of SaaS application with Next.js, TypeScript, Tailwind CSS, and more.
// You can find a live demo at: https://pro-demo.nextjs-boilerplate.com
export type PricingPlan = {
  id: PlanId;
  price: number;
  interval: BillingInterval;
  testPriceId: string; // Use for testing
  devPriceId: string;
  prodPriceId: string;
  features: {
    teamMember: number;
    website: number;
    storage: number;
    transfer: number;
  };
};

export type IStripeSubscription = {
  stripeSubscriptionId: string | null;
  stripeSubscriptionPriceId: string | null;
  stripeSubscriptionStatus: string | null;
  stripeSubscriptionCurrentPeriodEnd: number | null;
};

export type PlanDetails
  = | {
    isPaid: true;
    plan: PricingPlan;
    stripeDetails: IStripeSubscription;
  } | {
    isPaid: false;
    plan: PricingPlan;
  };
