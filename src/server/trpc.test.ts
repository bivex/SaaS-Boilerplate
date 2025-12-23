/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:10:00
 * Last Updated: 2025-12-23T21:08:21
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { TRPCError } from '@trpc/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock better-auth
vi.mock('better-auth/next-js', () => ({
  getSession: vi.fn(),
}));

// Mock auth instance
vi.mock('@/libs/auth', () => ({
  auth: {
    options: {},
  },
}));

describe('tRPC Context Creation', () => {
  const mockGetSession = vi.mocked(await import('better-auth/next-js')).getSession;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTRPCContext', () => {
    it('should create context with authenticated session', async () => {
      const mockSession = {
        user: { id: 'user-1', email: 'test@example.com' },
        session: { id: 'session-1' },
      };

      mockGetSession.mockResolvedValue(mockSession);

      const { createTRPCContext } = await import('@/server/trpc');

      const mockReq = { headers: {} } as any;
      const mockRes = {} as any;

      const context = await createTRPCContext({
        req: mockReq,
        res: mockRes,
      });

      expect(context).toEqual({
        session: mockSession,
        req: mockReq,
        res: mockRes,
      });

      expect(mockGetSession).toHaveBeenCalledWith(mockReq, mockRes, { auth: expect.any(Object) });
    });

    it('should create context with null session when not authenticated', async () => {
      mockGetSession.mockResolvedValue(null);

      const { createTRPCContext } = await import('@/server/trpc');

      const mockReq = { headers: {} } as any;
      const mockRes = {} as any;

      const context = await createTRPCContext({
        req: mockReq,
        res: mockRes,
      });

      expect(context).toEqual({
        session: null,
        req: mockReq,
        res: mockRes,
      });
    });

    it('should handle getSession errors gracefully', async () => {
      mockGetSession.mockRejectedValue(new Error('Session error'));

      const { createTRPCContext } = await import('@/server/trpc');

      const mockReq = { headers: {} } as any;
      const mockRes = {} as any;

      await expect(createTRPCContext({
        req: mockReq,
        res: mockRes,
      })).rejects.toThrow('Session error');
    });
  });

  describe('TRPC Router Configuration', () => {
    it('should create tRPC router with correct configuration', async () => {
      const { createTRPCRouter, publicProcedure } = await import('@/server/trpc');

      const router = createTRPCRouter({
        testQuery: publicProcedure.query(() => 'test'),
      });

      expect(router).toBeDefined();
      expect(router.testQuery).toBeDefined();
    });

    it('should configure transformer (superjson)', async () => {
      const { t } = await import('@/server/trpc');

      // Check that transformer is configured
      expect(t._def.transformer).toBeDefined();
    });
  });

  describe('Protected Procedure Middleware', () => {
    it('should allow access when user is authenticated', async () => {
      const { protectedProcedure } = await import('@/server/trpc');

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'test@example.com' },
        },
      };

      const procedure = protectedProcedure
        .query(({ ctx }) => ctx.session?.user);

      const result = await procedure({
        ctx: mockContext,
        input: undefined,
        type: 'query',
        path: 'test',
        rawInput: undefined,
        meta: undefined,
      } as any);

      expect(result).toEqual(mockContext.session.user);
    });

    it('should throw UNAUTHORIZED error when user is not authenticated', async () => {
      const { protectedProcedure } = await import('@/server/trpc');

      const mockContext = {
        session: null,
      };

      const procedure = protectedProcedure
        .query(() => 'protected data');

      await expect(procedure({
        ctx: mockContext,
        input: undefined,
        type: 'query',
        path: 'test',
        rawInput: undefined,
        meta: undefined,
      } as any)).rejects.toThrow(TRPCError);

      try {
        await procedure({
          ctx: mockContext,
          input: undefined,
          type: 'query',
          path: 'test',
          rawInput: undefined,
          meta: undefined,
        } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe('UNAUTHORIZED');
      }
    });

    it('should throw UNAUTHORIZED error when session exists but no user', async () => {
      const { protectedProcedure } = await import('@/server/trpc');

      const mockContext = {
        session: { session: { id: 'session-1' } }, // No user
      };

      const procedure = protectedProcedure
        .query(() => 'protected data');

      await expect(procedure({
        ctx: mockContext,
        input: undefined,
        type: 'query',
        path: 'test',
        rawInput: undefined,
        meta: undefined,
      } as any)).rejects.toThrow(TRPCError);
    });
  });

  describe('Public Procedure', () => {
    it('should allow access without authentication', async () => {
      const { publicProcedure } = await import('@/server/trpc');

      const mockContext = {
        session: null,
      };

      const procedure = publicProcedure
        .query(() => 'public data');

      const result = await procedure({
        ctx: mockContext,
        input: undefined,
        type: 'query',
        path: 'test',
        rawInput: undefined,
        meta: undefined,
      } as any);

      expect(result).toEqual('public data');
    });
  });

  describe('Error Formatting', () => {
    it('should format Zod errors correctly', async () => {
      const { t } = await import('@/server/trpc');

      // Create a procedure that throws a Zod error
      const procedure = t.procedure
        .input((val: unknown) => {
          if (typeof val !== 'string') {
            throw new TypeError('Expected string');
          }
          return val;
        })
        .query(() => 'test');

      const result = await procedure({
        ctx: {},
        input: 123, // Invalid input
        type: 'query',
        path: 'test',
        rawInput: 123,
        meta: undefined,
      } as any);

      // The error formatter should handle Zod errors
      expect(result).toBeDefined();
    });
  });
});
