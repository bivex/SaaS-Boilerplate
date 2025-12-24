/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:05:00
 * Last Updated: 2025-12-24T01:25:49
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/libs/auth';
import { db } from '@/libs/DB';
import { user } from '@/models/Schema';
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
          method: 'POST' as const,
        };

        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
          ...context,
        });

        // Return only serializable data
        return { success: true, user: result?.user, message: 'User created successfully' };
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
          method: 'POST' as const,
        };

        const result = await auth.api.signInEmail({
          body: {
            email: input.email,
            password: input.password,
          },
          ...context,
        });

        // Return only serializable data
        return { success: true, user: result?.user, message: 'Signed in successfully' };
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
        method: 'POST' as const,
      };

      await auth.api.signOut(context);

      // Return only serializable data
      return { success: true, message: 'Signed out successfully' };
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error(error instanceof Error ? error.message : 'Sign out failed');
    }
  }),

  // Get user profile (protected)
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.session?.user;
  }),

  // Link Google account
  linkGoogleAccount: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await db
        .update(user)
        .set({ googleLinked: true })
        .where(eq(user.id, userId));

      return { success: true, message: 'Google account linked successfully' };
    } catch (error) {
      console.error('Link Google account error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to link Google account');
    }
  }),

  // Unlink Google account
  unlinkGoogleAccount: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await db
        .update(user)
        .set({ googleLinked: false })
        .where(eq(user.id, userId));

      return { success: true, message: 'Google account unlinked successfully' };
    } catch (error) {
      console.error('Unlink Google account error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to unlink Google account');
    }
  }),

  // Check if Google account is linked
  isGoogleLinked: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        return { linked: false };
      }

      const userData = await db
        .select({ googleLinked: user.googleLinked })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      return { linked: userData[0]?.googleLinked || false };
    } catch (error) {
      console.error('Check Google linked error:', error);
      return { linked: false };
    }
  }),
});
