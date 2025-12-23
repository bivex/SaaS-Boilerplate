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

import { z } from 'zod';
import { authClient } from '@/libs/auth-client';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/trpc';

export const authRouter = createTRPCRouter({
  // Get current session
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),

  // Sign up with email and password
  signUp: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await authClient.signUp.email({
          email: input.email,
          password: input.password,
          name: input.name,
        });

        if (result.error) {
          throw new Error(result.error.message || 'Sign up failed');
        }

        return { success: true, data: result.data };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Sign up failed');
      }
    }),

  // Sign in with email and password
  signIn: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await authClient.signIn.email({
          email: input.email,
          password: input.password,
        });

        if (result.error) {
          throw new Error(result.error.message || 'Sign in failed');
        }

        return { success: true, data: result.data };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Sign in failed');
      }
    }),

  // Sign out
  signOut: protectedProcedure.mutation(async () => {
    try {
      await authClient.signOut();
      return { success: true };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Sign out failed');
    }
  }),

  // Get user profile (protected)
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.session?.user;
  }),
});
