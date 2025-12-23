/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T19:40:59
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const Env = createEnv({
  server: {
    WORKOS_API_KEY: z.string().min(1),
    WORKOS_CLIENT_ID: z.string().min(1),
    WORKOS_COOKIE_PASSWORD: z.string().min(32),
    DATABASE_URL: z.string().optional(),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    BILLING_PLAN_ENV: z.enum(['dev', 'test', 'prod']),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_WORKOS_REDIRECT_URI: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    WORKOS_API_KEY: process.env.WORKOS_API_KEY,
    WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
    WORKOS_COOKIE_PASSWORD: process.env.WORKOS_COOKIE_PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    BILLING_PLAN_ENV: process.env.BILLING_PLAN_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WORKOS_REDIRECT_URI: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
});
