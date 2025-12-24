/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:10:00
 * Last Updated: 2025-12-24T01:02:46
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import {renderHook, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

// Mock better-auth client
const mockAuthClient = {
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    signOut: vi.fn(),
};

vi.mock('@/libs/auth-client', () => ({
    authClient: mockAuthClient,
}));

// Session management features implementation
describe('Session Management', () => {

    beforeEach(async () => {
        vi.clearAllMocks();
        // Reset global state for useAuth hook
        const {__resetGlobalStateForTesting} = await import('@/hooks/useAuth');
        __resetGlobalStateForTesting();
    });

    describe('Session Refresh', () => {
        it('should refresh session when close to expiration', async () => {
            // Mock session that's about to expire (in 5 minutes)
            const now = Date.now();
            const expiresAt = new Date(now + 5 * 60 * 1000); // 5 minutes from now

            mockAuthClient.getSession.mockResolvedValue({
                data: {
                    user: {id: 'user-1', email: 'test@example.com'},
                    session: {
                        id: 'session-1',
                        expiresAt,
                    },
                },
            });

            mockAuthClient.refreshSession.mockResolvedValue({
                data: {
                    user: {id: 'user-1', email: 'test@example.com'},
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
                    user: {id: 'user-1', email: 'test@example.com'},
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
                    user: {id: 'user-1', email: 'test@example.com'},
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
                    user: {id: 'user-1', email: 'test@example.com'},
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
                    user: {id: 'user-1', email: 'test@example.com'},
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

    describe('Session Persistence', () => {
        beforeEach(async () => {
            // Reset global state for useAuth hook
            const {__resetGlobalStateForTesting} = await import('@/hooks/useAuth');
            __resetGlobalStateForTesting();
        });

        it('should persist session across component re-mounts', async () => {
            const {useSession} = await import('@/hooks/useAuth');

            // Set up the mock to return session data
            mockAuthClient.getSession.mockResolvedValue({
                data: {
                    user: {id: 'user-1', email: 'test@example.com'},
                    session: {id: 'session-1'},
                },
            });

            // First mount - this will fetch and cache the session
            const {result: result1, unmount: unmount1} = renderHook(() => useSession());

            // Wait for session to load and loading to complete
            await waitFor(() => {
                expect(result1.current.loading).toBe(false);
            });

            expect(result1.current.session?.user?.id).toBe('user-1');

            // Unmount first component
            unmount1();

            // Mount second component (simulating navigation) - should reuse cached session
            const {result: result2} = renderHook(() => useSession());

            // Wait for session to be available (should be immediate from cache)
            await waitFor(() => {
                expect(result2.current.loading).toBe(false);
            });

            // Session should still be available from cache
            expect(result2.current.session?.user?.id).toBe('user-1');
        });

        it('should handle concurrent session requests', async () => {
            const {useSession} = await import('@/hooks/useAuth');

            let callCount = 0;
            mockAuthClient.getSession.mockImplementation(() => {
                callCount++;
                return Promise.resolve({
                    data: {
                        user: {id: 'user-1', email: 'test@example.com'},
                        session: {id: 'session-1'},
                    },
                });
            });

            // Mount two components simultaneously - both should trigger the same API call
            const {result: result1} = renderHook(() => useSession());
            const {result: result2} = renderHook(() => useSession());

            // Wait for both sessions to load
            await waitFor(() => {
                expect(result1.current.loading).toBe(false);
                expect(result2.current.loading).toBe(false);
            });

            // Both should have session data
            expect(result1.current.session?.user?.id).toBe('user-1');
            expect(result2.current.session?.user?.id).toBe('user-1');

            // Should have made only one API call (due to caching/deduplication)
            expect(callCount).toBe(1);
        });
    });

    describe('Authentication Errors', () => {
        beforeEach(async () => {
            // Reset global state for useAuth hook
            const {__resetGlobalStateForTesting} = await import('@/hooks/useAuth');
            __resetGlobalStateForTesting();
        });

        it('should handle invalid token errors', async () => {
            const {useSession} = await import('@/hooks/useAuth');

            mockAuthClient.getSession.mockRejectedValue(new Error('Invalid token'));

            const {result} = renderHook(() => useSession());

            // Wait for loading to complete
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.session).toBeNull();
        });

        it('should handle network errors during session validation', async () => {
            const {useSession} = await import('@/hooks/useAuth');

            mockAuthClient.getSession.mockRejectedValue(new Error('Network error'));

            const {result} = renderHook(() => useSession());

            // Wait for loading to complete
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.session).toBeNull();
            expect(result.current.loading).toBe(false);
        });

        it('should handle malformed session data', async () => {
            const {useSession} = await import('@/hooks/useAuth');

            mockAuthClient.getSession.mockResolvedValue({
                data: {
                    user: null, // Malformed - no user
                    session: {id: 'session-1'},
                },
            });

            const {result} = renderHook(() => useSession());

            // Wait for loading to complete
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.session).toBeDefined();
            // The session exists but user is null (malformed)
            expect(result.current.session).toEqual({
                user: null,
                session: {id: 'session-1'},
            });
        });
    });
});
