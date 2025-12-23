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

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authClient } from '@/libs/auth-client';
import { useSession, useSignOut, useUser } from './useAuth';

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
      (authClient.getSession as any).mockResolvedValue({ data: null });

      const { result } = renderHook(() => useSession());

      expect(result.current.session).toBeNull();
      expect(result.current.loading).toBe(true);
    });

    it('should return session data when available', async () => {
      const mockSession = {
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        organization: null,
      };
      (authClient.getSession as any).mockResolvedValue({ data: mockSession });

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toEqual(mockSession);
    });

    it('should handle errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (authClient.getSession as any).mockRejectedValue(new Error('Auth error'));

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
      (authClient.getSession as any).mockResolvedValue({ data: mockSession });

      const { result } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('should return null when no session', () => {
      (authClient.getSession as any).mockResolvedValue({ data: null });

      const { result } = renderHook(() => useUser());

      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(true);
    });
  });

  describe('useSignOut', () => {
    it('should call signOut and redirect on success', async () => {
      (authClient.signOut as any).mockResolvedValue({ success: true });

      // Mock window.location
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: '' } as any;

      const { result } = renderHook(() => useSignOut());

      await act(async () => {
        await result.current.signOut();
      });

      expect(authClient.signOut).toHaveBeenCalledTimes(1);
      expect(window.location.href).toBe('/');

      // Restore window.location
      window.location = originalLocation;
    });

    it('should handle signOut errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (authClient.signOut as any).mockRejectedValue(new Error('Sign out failed'));

      const { result } = renderHook(() => useSignOut());

      await act(async () => {
        await result.current.signOut();
      });

      expect(authClient.signOut).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });
});
