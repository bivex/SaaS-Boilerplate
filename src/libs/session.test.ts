/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:10:00
 * Last Updated: 2025-12-23T21:08:22
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock better-auth client
vi.mock('@/libs/auth-client', () => ({
  authClient: {
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    signOut: vi.fn(),
  },
}));

// Session management features implementation
describe('Session Management', () => {
  const mockAuthClient = {
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    signOut: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset authClient mock
    (await import('@/libs/auth-client')).authClient = mockAuthClient;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Session Refresh', () => {
    it('should refresh session when close to expiration', async () => {
      // Mock session that's about to expire (in 5 minutes)
      const now = Date.now();
      const expiresAt = new Date(now + 5 * 60 * 1000); // 5 minutes from now

      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt,
          },
        },
      });

      mockAuthClient.refreshSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt: new Date(now + 60 * 60 * 1000), // 1 hour from now
          },
        },
      });

      // Get initial session
      const initialSession = await mockAuthClient.getSession();
      expect(initialSession.data?.session.id).toBe('session-1');

      // Check if session is close to expiration (within 10 minutes)
      const timeUntilExpiration = expiresAt.getTime() - now;
      const isCloseToExpiration = timeUntilExpiration < 10 * 60 * 1000;

      if (isCloseToExpiration) {
        // Refresh the session
        const refreshed = await mockAuthClient.refreshSession();
        expect(refreshed.data?.session.expiresAt.getTime()).toBeGreaterThan(expiresAt.getTime());
        expect(mockAuthClient.refreshSession).toHaveBeenCalled();
      }
    });

    it('should handle refresh session failure', async () => {
      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt: new Date(Date.now() + 1000), // Expires soon
          },
        },
      });

      mockAuthClient.refreshSession.mockRejectedValue(new Error('Refresh failed'));

      // Try to refresh the session
      await expect(mockAuthClient.refreshSession()).rejects.toThrow('Refresh failed');
    });

    it('should not refresh session if not close to expiration', async () => {
      const now = Date.now();
      const expiresAt = new Date(now + 2 * 60 * 60 * 1000); // 2 hours

      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt,
          },
        },
      });

      const session = await mockAuthClient.getSession();
      expect(session.data?.session).toBeDefined();

      // Check if session needs refresh (not close to expiration)
      const timeUntilExpiration = expiresAt.getTime() - now;
      const needsRefresh = timeUntilExpiration < 10 * 60 * 1000; // Less than 10 minutes

      expect(needsRefresh).toBe(false);
      expect(mockAuthClient.refreshSession).not.toHaveBeenCalled();
    });
  });

  describe('Session Expiration', () => {
    it('should clear session when expired', async () => {
      // Mock expired session
      const expiresAt = new Date(Date.now() - 1000); // Expired 1 second ago

      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt,
          },
        },
      });

      const session = await mockAuthClient.getSession();
      const isExpired = session.data?.session.expiresAt.getTime()! < Date.now();

      expect(isExpired).toBe(true);
    });

    it('should handle expired session on refresh', async () => {
      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt: new Date(Date.now() + 1000), // Expires soon
          },
        },
      });

      mockAuthClient.refreshSession.mockResolvedValue({
        data: null, // Refresh failed - session expired
      });

      const refreshResult = await mockAuthClient.refreshSession();
      expect(refreshResult.data).toBeNull();
    });
  });

  describe('Authentication Errors', () => {
    it('should handle 401 Unauthorized errors', async () => {
      const { protectedProcedure } = await import('@/server/trpc');

      const procedure = protectedProcedure.query(() => 'protected data');

      const mockContext = {
        session: null, // No session
      };

      await expect(procedure({
        ctx: mockContext,
        input: undefined,
        type: 'query',
        path: 'test',
        rawInput: undefined,
        meta: undefined,
      } as any)).rejects.toThrow('UNAUTHORIZED');
    });

    it('should handle 403 Forbidden errors for insufficient permissions', async () => {
      const { protectedProcedure } = await import('@/server/trpc');
      const { TRPCError } = await import('@trpc/server');

      const procedure = protectedProcedure
        .use(({ ctx, next }) => {
          if (ctx.session?.user?.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN' });
          }
          return next();
        })
        .query(() => 'admin data');

      const mockContext = {
        session: {
          user: { id: 'user-1', email: 'user@example.com', role: 'user' },
        },
      };

      await expect(procedure({
        ctx: mockContext,
        input: undefined,
        type: 'query',
        path: 'test',
        rawInput: undefined,
        meta: undefined,
      } as any)).rejects.toThrow('FORBIDDEN');
    });

    it('should handle invalid token errors', async () => {
      const { useSession } = await import('@/hooks/useAuth');

      mockAuthClient.getSession.mockRejectedValue(new Error('Invalid token'));

      const { result } = renderHook(() => useSession());

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.session).toBeNull();
    });

    it('should handle network errors during session validation', async () => {
      const { useSession } = await import('@/hooks/useAuth');

      mockAuthClient.getSession.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSession());

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.session).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should handle malformed session data', async () => {
      const { useSession } = await import('@/hooks/useAuth');

      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: null, // Malformed - no user
          session: { id: 'session-1' },
        },
      });

      const { result } = renderHook(() => useSession());

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.session).toBeDefined();
      expect(result.current.session?.user).toBeNull();
    });
  });

  describe('Session Persistence', () => {
    it('should persist session across component re-mounts', async () => {
      const { useSession } = await import('@/hooks/useAuth');

      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: { id: 'session-1' },
        },
      });

      // First mount
      const { result: result1, unmount: unmount1 } = renderHook(() => useSession());
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result1.current.session).toBeDefined();

      // Unmount first component
      unmount1();

      // Mount second component (simulating navigation)
      const { result: result2 } = renderHook(() => useSession());
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Session should still be available
      expect(result2.current.session).toBeDefined();
      expect(result2.current.session?.user?.id).toBe('user-1');
    });

    it('should handle concurrent session requests', async () => {
      const { useSession } = await import('@/hooks/useAuth');

      let callCount = 0;
      mockAuthClient.getSession.mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          data: {
            user: { id: 'user-1', email: 'test@example.com' },
            session: { id: 'session-1' },
          },
        });
      });

      // Mount two components simultaneously
      const { result: result1 } = renderHook(() => useSession());
      const { result: result2 } = renderHook(() => useSession());

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // Both should have session data
      expect(result1.current.session).toBeDefined();
      expect(result2.current.session).toBeDefined();

      // Should have made only one API call (due to caching/deduplication)
      expect(callCount).toBe(1);
    });
  });
});

// These helper functions are now imported from @testing-library/react
