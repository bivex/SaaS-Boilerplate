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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock better-auth client
vi.mock('@/libs/auth-client', () => ({
  authClient: {
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe('Session Management', () => {
  const mockAuthClient = {
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    signOut: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset authClient mock
    vi.mocked(await import('@/libs/auth-client')).authClient = mockAuthClient;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Session Refresh', () => {
    it('should refresh session when close to expiration', async () => {
      const { useSession } = await import('@/hooks/useAuth');

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

      // Mock timers
      vi.useFakeTimers();
      vi.setSystemTime(now);

      const { result } = renderHook(() => useSession());

      // Wait for initial session load
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.session).toBeDefined();

      // Advance time to 4 minutes before expiration
      await act(async () => {
        vi.advanceTimersByTime(4 * 60 * 1000);
      });

      // Session should still be valid (not expired)
      expect(result.current.session).toBeDefined();

      // Advance time to 30 seconds before expiration
      await act(async () => {
        vi.advanceTimersByTime(30 * 1000);
      });

      // Should trigger refresh
      expect(mockAuthClient.refreshSession).toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should handle refresh session failure', async () => {
      const { useSession } = await import('@/hooks/useAuth');

      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt: new Date(Date.now() + 1000), // Expires in 1 second
          },
        },
      });

      mockAuthClient.refreshSession.mockRejectedValue(new Error('Refresh failed'));

      vi.useFakeTimers();

      const { result } = renderHook(() => useSession());

      await act(async () => {
        vi.advanceTimersByTime(2000); // Past expiration
      });

      // Session should be cleared on refresh failure
      expect(result.current.session).toBeNull();

      vi.useRealTimers();
    });

    it('should not refresh session if not close to expiration', async () => {
      const { useSession } = await import('@/hooks/useAuth');

      // Session expires in 2 hours
      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
          },
        },
      });

      const { result } = renderHook(() => useSession());

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.session).toBeDefined();
      expect(mockAuthClient.refreshSession).not.toHaveBeenCalled();
    });
  });

  describe('Session Expiration', () => {
    it('should clear session when expired', async () => {
      const { useSession } = await import('@/hooks/useAuth');

      // Mock expired session
      mockAuthClient.getSession.mockResolvedValue({
        data: {
          user: { id: 'user-1', email: 'test@example.com' },
          session: {
            id: 'session-1',
            expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
          },
        },
      });

      const { result } = renderHook(() => useSession());

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.session).toBeNull();
    });

    it('should handle expired session on refresh', async () => {
      const { useSession } = await import('@/hooks/useAuth');

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

      vi.useFakeTimers();

      const { result } = renderHook(() => useSession());

      await act(async () => {
        vi.advanceTimersByTime(2000); // Past expiration
      });

      expect(result.current.session).toBeNull();

      vi.useRealTimers();
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

// Helper functions for testing
async function renderHook<T>(hook: () => T) {
  let result: { current: T };
  let unmount: () => void;

  const TestComponent = () => {
    result = { current: hook() };
    return null;
  };

  // Mock React for testing
  const React = await import('react');
  const { render } = await import('@testing-library/react');

  const { unmount: unmountFn } = render(React.createElement(TestComponent));

  return {
    result: result!,
    unmount: unmountFn,
  };
}

async function act(fn: () => Promise<void>) {
  await fn();
}
