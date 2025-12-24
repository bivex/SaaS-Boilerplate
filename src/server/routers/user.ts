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

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { user } from '@/models/Schema';
import { createTRPCRouter, protectedProcedure } from '@/server/trpc';

export const userRouter = createTRPCRouter({
  // Get user profile (same as auth.getProfile but in user namespace)
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.session?.user;
  }),

  // Get user by ID
  getById: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        return null;
      }

      const result = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      return result[0] || null;
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }

      await db
        .update(user)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      return { success: true };
    }),
});
