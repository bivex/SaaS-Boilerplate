/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:25:00
 * Last Updated: 2025-12-23T23:25:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserButton } from './UserButton';
import { useUser, useSignOut } from '@/hooks/useAuth';

// Mock the hooks
vi.mock('@/hooks/useAuth', () => ({
  useUser: vi.fn(),
  useSignOut: vi.fn(),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

describe('UserButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when user data is loading', () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true });

    render(<UserButton />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show sign in button when no user', () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false });
    vi.mocked(useSignOut).mockReturnValue({ signOut: vi.fn() });

    render(<UserButton />);

    const signInButton = screen.getByText('sign_in');
    expect(signInButton).toBeInTheDocument();

    fireEvent.click(signInButton);
    expect(mockPush).toHaveBeenCalledWith('/sign-in');
  });

  it('should show user avatar and menu when user exists', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      image: 'avatar.jpg',
    };
    const mockSignOut = vi.fn();

    vi.mocked(useUser).mockReturnValue({ user: mockUser, loading: false });
    vi.mocked(useSignOut).mockReturnValue({ signOut: mockSignOut });

    render(<UserButton />);

    // Avatar should be rendered
    const avatar = screen.getByRole('button');
    expect(avatar).toBeInTheDocument();

    // Click to open dropdown
    fireEvent.click(avatar);

    // Check menu items
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('profile')).toBeInTheDocument();
      expect(screen.getByText('organization')).toBeInTheDocument();
      expect(screen.getByText('sign_out')).toBeInTheDocument();
    });
  });

  it('should generate correct initials from user name', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'John Doe',
    };

    vi.mocked(useUser).mockReturnValue({ user: mockUser, loading: false });
    vi.mocked(useSignOut).mockReturnValue({ signOut: vi.fn() });

    render(<UserButton />);

    // Should show "JD" as initials
    const fallback = screen.getByText('JD');
    expect(fallback).toBeInTheDocument();
  });

  it('should use first letter of email when no name', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: '',
    };

    vi.mocked(useUser).mockReturnValue({ user: mockUser, loading: false });
    vi.mocked(useSignOut).mockReturnValue({ signOut: vi.fn() });

    render(<UserButton />);

    const fallback = screen.getByText('T');
    expect(fallback).toBeInTheDocument();
  });

  it('should navigate to profile page when profile clicked', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };

    vi.mocked(useUser).mockReturnValue({ user: mockUser, loading: false });
    vi.mocked(useSignOut).mockReturnValue({ signOut: vi.fn() });

    render(<UserButton />);

    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);

    const profileLink = screen.getByText('profile');
    fireEvent.click(profileLink);

    expect(mockPush).toHaveBeenCalledWith('/dashboard/user-profile');
  });

  it('should navigate to organization page when organization clicked', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };

    vi.mocked(useUser).mockReturnValue({ user: mockUser, loading: false });
    vi.mocked(useSignOut).mockReturnValue({ signOut: vi.fn() });

    render(<UserButton />);

    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);

    const orgLink = screen.getByText('organization');
    fireEvent.click(orgLink);

    expect(mockPush).toHaveBeenCalledWith('/dashboard/organization-profile');
  });

  it('should call signOut when sign out clicked', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };
    const mockSignOut = vi.fn();

    vi.mocked(useUser).mockReturnValue({ user: mockUser, loading: false });
    vi.mocked(useSignOut).mockReturnValue({ signOut: mockSignOut });

    render(<UserButton />);

    const avatar = screen.getByRole('button');
    fireEvent.click(avatar);

    const signOutButton = screen.getByText('sign_out');
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
