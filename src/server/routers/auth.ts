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
import { auth } from '@/libs/auth';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/trpc';

export const authRouter = createTRPCRouter({
  // Get current session
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),

  // Sign up with email and password
  signUp: publicProcedure
    .input(z.object({
      email: z.string(),
      password: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Create a proper context for Better Auth server API
        const context = {
          request: ctx.req,
          headers: ctx.req.headers,
          url: ctx.req.url,
          method: ctx.req.method,
        };

        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
          ...context,
        });

        return { success: true, data: result };
      } catch (error) {
        console.error('Sign up error:', error);
        throw new Error(error instanceof Error ? error.message : 'Sign up failed');
      }
    }),

  // Sign in with email and password
  signIn: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Create a proper context for Better Auth server API
        const context = {
          request: ctx.req,
          headers: ctx.req.headers,
          url: ctx.req.url,
          method: ctx.req.method,
        };

        const result = await auth.api.signInEmail({
          body: {
            email: input.email,
            password: input.password,
          },
          ...context,
        });

        return { success: true, data: result };
      } catch (error) {
        console.error('Sign in error:', error);
        throw new Error(error instanceof Error ? error.message : 'Sign in failed');
      }
    }),

  // Sign out
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Create a proper context for Better Auth server API
      const context = {
        request: ctx.req,
        headers: ctx.req.headers,
        url: ctx.req.url,
        method: ctx.req.method,
      };

      const result = await auth.api.signOut(context);

      return { success: true, data: result };
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error(error instanceof Error ? error.message : 'Sign out failed');
    }
  }),

  // Get user profile (protected)
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.session?.user;
  }),
});
