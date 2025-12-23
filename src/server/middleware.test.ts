/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T00:45:00
 * Last Updated: 2025-12-23T22:33:19
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { TRPCError } from '@trpc/server';
import { describe, expect, it, vi } from 'vitest';
import { requireRole, requireScope, requireOwnership, rateLimit } from './middleware';
import { createCallerFactory } from '@trpc/server/unstable-core-do-not-import';
import type { t } from './trpc';

// Mock the rate limit manager
vi.mock('@/libs/security', () => ({
  rateLimitManager: {
    check: vi.fn(),
  },
}));

describe('Authorization Middleware', () => {
  describe('Role-Based Access Control (RBAC)', () => {
    it('should allow access for admin role', async () => {
      const appRouter = t.router({
        adminData: t.procedure
          .use(requireRole('admin'))
          .query(() => 'admin data'),
      });

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'admin@example.com', role: 'admin' },
        },
      };

      const caller = createCallerFactory(appRouter)(mockContext);
      const result = await caller.adminData();

      expect(result).toBe('admin data');
    });

    it('should deny access for non-admin role', async () => {
      const appRouter = t.router({
        adminData: t.procedure
          .use(requireRole('admin'))
          .query(() => 'admin data'),
      });

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'user@example.com', role: 'user' },
        },
      };

      const caller = createCaller(appRouter, mockContext);

      await expect(caller.adminData()).rejects.toThrow(TRPCError);

      try {
        await caller.adminData();
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe('FORBIDDEN');
      }
    });

    it('should allow access for multiple allowed roles', async () => {
      const appRouter = t.router({
        managementData: t.procedure
          .use(requireRole(['admin', 'manager']))
          .query(() => 'management data'),
      });

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'manager@example.com', role: 'manager' },
        },
      };

      const caller = createCaller(appRouter, mockContext);
      const result = await caller.managementData();

      expect(result).toBe('management data');
    });
  });

  describe('Scope-Based Permissions', () => {
    it('should allow access with required scope', async () => {
      const scopedProcedure = t.procedure
        .use(requireScope('read:users'))
        .query(() => 'scoped data');

      const mockContext = {
        session: {
          user: {
            id: 'user-1',
            email: 'user@example.com',
            scopes: ['read:users', 'write:posts'],
          },
        },
      };

      const caller = t.createCallerFactory(scopedProcedure)(mockContext);
      const result = await caller();

      expect(result).toBe('scoped data');
    });

    it('should deny access without required scope', async () => {
      const scopedProcedure = t.procedure
        .use(requireScope('admin:delete'))
        .mutation(() => 'deleted');

      const mockContext = {
        session: {
          user: {
            id: 'user-1',
            email: 'user@example.com',
            scopes: ['read:users', 'write:posts'],
          },
        },
      };

      const caller = t.createCallerFactory(scopedProcedure)(mockContext);

      await expect(caller()).rejects.toThrow(TRPCError);
    });

    it('should allow access with wildcard scope', async () => {
      const wildcardProcedure = t.procedure
        .use(requireScope('admin:*'))
        .query(() => 'wildcard data');

      const mockContext = {
        session: {
          user: {
            id: 'user-1',
            email: 'admin@example.com',
            scopes: ['admin:*'],
          },
        },
      };

      const caller = t.createCallerFactory(wildcardProcedure)(mockContext);
      const result = await caller();

      expect(result).toBe('wildcard data');
    });
  });

  describe('Resource Ownership Checks', () => {
    it('should allow access to owned resources', async () => {
      const ownershipProcedure = t.procedure
        .input((input: { resourceId: string }) => input)
        .use(requireOwnership((ctx, input) => {
          // Simulate database check for resource ownership
          const resourceOwnerId = 'user-1'; // Would come from DB
          return ctx.session?.user?.id === resourceOwnerId;
        }))
        .query(({ input }) => `resource ${input.resourceId} data`);

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'user@example.com' },
        },
      };

      const caller = t.createCallerFactory(ownershipProcedure)(mockContext);
      const result = await caller({ resourceId: 'resource-1' });

      expect(result).toBe('resource resource-1 data');
    });

    it('should deny access to non-owned resources', async () => {
      const ownershipProcedure = t.procedure
        .input((input: { resourceId: string }) => input)
        .use(requireOwnership((ctx, input) => {
          const resourceOwnerId = 'user-2'; // Different owner
          return ctx.session?.user?.id === resourceOwnerId;
        }))
        .query(() => 'resource data');

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'user@example.com' },
        },
      };

      const caller = t.createCallerFactory(ownershipProcedure)(mockContext);

      await expect(caller({ resourceId: 'resource-1' })).rejects.toThrow(TRPCError);
    });
  });

  describe('Rate Limiting Middleware', () => {
    it('should allow requests within rate limit', async () => {
      const { rateLimitManager } = await import('@/libs/security');

      // Mock rate limit check to allow request
      vi.mocked(rateLimitManager.check).mockResolvedValue({
        allowed: true,
        reset: new Date(Date.now() + 15 * 60 * 1000),
      });

      const rateLimitedProcedure = t.procedure
        .use(rateLimit())
        .query(() => 'rate limited data');

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'user@example.com' },
        },
      };

      const caller = t.createCallerFactory(rateLimitedProcedure)(mockContext);
      const result = await caller();

      expect(result).toBe('rate limited data');
      expect(rateLimitManager.check).toHaveBeenCalledWith('user-1');
    });

    it('should block requests over rate limit', async () => {
      const { rateLimitManager } = await import('@/libs/security');

      // Mock rate limit check to block request
      vi.mocked(rateLimitManager.check).mockResolvedValue({
        allowed: false,
        reset: new Date(Date.now() + 15 * 60 * 1000),
      });

      const rateLimitedProcedure = t.procedure
        .use(rateLimit())
        .query(() => 'rate limited data');

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'user@example.com' },
        },
      };

      const caller = t.createCallerFactory(rateLimitedProcedure)(mockContext);

      await expect(caller()).rejects.toThrow(TRPCError);

      try {
        await caller();
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe('TOO_MANY_REQUESTS');
      }
    });
  });

  describe('Chained Middleware', () => {
    it('should execute middleware in correct order', async () => {
      const executionOrder: string[] = [];

      const chainedProcedure = t.procedure
        .use((opts) => {
          executionOrder.push('middleware1');
          return opts.next();
        })
        .use((opts) => {
          executionOrder.push('middleware2');
          return opts.next();
        })
        .use((opts) => {
          executionOrder.push('middleware3');
          return opts.next();
        })
        .query(() => {
          executionOrder.push('resolver');
          return 'chained result';
        });

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'user@example.com' },
        },
      };

      const caller = t.createCallerFactory(chainedProcedure)(mockContext);
      const result = await caller();

      expect(result).toBe('chained result');
      expect(executionOrder).toEqual(['middleware1', 'middleware2', 'middleware3', 'resolver']);
    });

    it('should stop execution on middleware error', async () => {
      const executionOrder: string[] = [];

      const failingProcedure = t.procedure
        .use((opts) => {
          executionOrder.push('middleware1');
          return opts.next();
        })
        .use(() => {
          executionOrder.push('middleware2');
          throw new TRPCError({ code: 'FORBIDDEN' });
        })
        .use((opts) => {
          executionOrder.push('middleware3'); // Should not execute
          return opts.next();
        })
        .query(() => {
          executionOrder.push('resolver'); // Should not execute
          return 'result';
        });

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'user@example.com' },
        },
      };

      const caller = t.createCallerFactory(failingProcedure)(mockContext);

      await expect(caller()).rejects.toThrow(TRPCError);

      expect(executionOrder).toEqual(['middleware1', 'middleware2']);
    });
  });
});
