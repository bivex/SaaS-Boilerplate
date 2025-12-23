/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:05:00
 * Last Updated: 2025-12-23T21:05:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { createTRPCRouter } from '@/server/trpc';
import { authRouter } from './auth';
// import { organizationRouter } from './organization';
// import { userRouter } from './user';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  // user: userRouter,
  // organization: organizationRouter,
});

export type AppRouter = typeof appRouter;
