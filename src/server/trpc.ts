/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:05:00
 * Last Updated: 2025-12-23T22:27:08
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

/// <reference types="node" />
import { initTRPC, TRPCError } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import superjson from 'superjson';
import { auth } from '@/libs/auth';
import { ZodError } from 'zod';

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  try {
    // Get session using proper Better Auth API
    // Convert Request headers to Headers object for better-auth
    const headers = new Headers(opts.req.headers);
    const session = await auth.api.getSession({
      headers,
    });
    return {
      session,
      req: opts.req,
    };
  } catch (error) {
    // If session fetching fails, return null session
    console.error('Failed to get session in tRPC context:', error);
    return {
      session: null,
      req: opts.req,
    };
  }
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? (error.cause as ZodError).flatten()
            : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
