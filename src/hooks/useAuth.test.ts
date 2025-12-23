/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:15:00
 * Last Updated: 2025-12-23T23:15:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSession, useUser, useSignOut } from './useAuth';
import { authClient } from '@/libs/auth-client';

// Mock the auth client
vi.mock('@/libs/auth-client', () => ({
  authClient: {
    getSession: vi.fn(),
    signOut: vi.fn(),
  },
}));

describe('useAuth hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('useSession', () => {
    it('should return loading state initially', () => {
      const mockGetSession = vi.fn().mockResolvedValue({ data: null });
      vi.mocked(authClient.getSession).mockImplementation(mockGetSession);

      const { result } = renderHook(() => useSession());

      expect(result.current.session).toBeNull();
      expect(result.current.loading).toBe(true);
    });

    it('should return session data when available', async () => {
      const mockSession = {
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        organization: null,
      };
      const mockGetSession = vi.fn().mockResolvedValue({ data: mockSession });
      vi.mocked(authClient.getSession).mockImplementation(mockGetSession);

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toEqual(mockSession);
    });

    it('should handle errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockGetSession = vi.fn().mockRejectedValue(new Error('Auth error'));
      vi.mocked(authClient.getSession).mockImplementation(mockGetSession);

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting session:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('useUser', () => {
    it('should return user data from session', async () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      const mockSession = { user: mockUser, organization: null };
      const mockGetSession = vi.fn().mockResolvedValue({ data: mockSession });
      vi.mocked(authClient.getSession).mockImplementation(mockGetSession);

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('should return null when no session', () => {
      const mockGetSession = vi.fn().mockResolvedValue({ data: null });
      vi.mocked(authClient.getSession).mockImplementation(mockGetSession);

      const { result } = renderHook(() => useUser());

      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(true);
    });
  });

  describe('useSignOut', () => {
    it('should call signOut and redirect on success', async () => {
      const mockSignOut = vi.fn().mockResolvedValue({ success: true });
      vi.mocked(authClient.signOut).mockImplementation(mockSignOut);

      // Mock window.location
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: '' } as any;

      const { result } = renderHook(() => useSignOut());

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(window.location.href).toBe('/');

      // Restore window.location
      window.location = originalLocation;
    });

    it('should handle signOut errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockSignOut = vi.fn().mockRejectedValue(new Error('Sign out failed'));
      vi.mocked(authClient.signOut).mockImplementation(mockSignOut);

      const { result } = renderHook(() => useSignOut());

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });
});
