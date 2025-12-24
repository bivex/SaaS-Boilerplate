/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:25:00
 * Last Updated: 2025-12-24T01:03:42
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {useSignOut, useUser} from '@/hooks/useAuth';
import {UserButton} from './UserButton';

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
    useRouter: vi.fn(() => ({push: mockPush})),
}));

describe('UserButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show loading state when user data is loading', () => {
        (useUser as any).mockReturnValue({user: null, loading: true});
        (useSignOut as any).mockReturnValue({signOut: vi.fn()});

        render(<UserButton/>);

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show sign in button when no user', async () => {
        (useUser as any).mockReturnValue({user: null, loading: false});
        (useSignOut as any).mockReturnValue({signOut: vi.fn()});

        render(<UserButton/>);

        const signInButton = screen.getByText('sign_in');

        expect(signInButton).toBeInTheDocument();

        await userEvent.click(signInButton);

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

        (useUser as any).mockReturnValue({user: mockUser, loading: false});
        (useSignOut as any).mockReturnValue({signOut: mockSignOut});

        render(<UserButton/>);

        // Avatar should be rendered
        const avatar = screen.getByRole('button');

        expect(avatar).toBeInTheDocument();

        // Click to open dropdown
        const user = userEvent.setup();
        await user.click(avatar);

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

        (useUser as any).mockReturnValue({user: mockUser, loading: false});
        (useSignOut as any).mockReturnValue({signOut: vi.fn()});

        render(<UserButton/>);

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

        (useUser as any).mockReturnValue({user: mockUser, loading: false});
        (useSignOut as any).mockReturnValue({signOut: vi.fn()});

        render(<UserButton/>);

        const fallback = screen.getByText('T');

        expect(fallback).toBeInTheDocument();
    });

    it('should navigate to profile page when profile clicked', async () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
        };

        (useUser as any).mockReturnValue({user: mockUser, loading: false});
        (useSignOut as any).mockReturnValue({signOut: vi.fn()});

        render(<UserButton/>);

        const avatar = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(avatar);

        await waitFor(() => {
            expect(screen.getByText('profile')).toBeInTheDocument();
        });

        const profileLink = screen.getByText('profile');
        await user.click(profileLink);

        expect(mockPush).toHaveBeenCalledWith('/dashboard/user-profile');
    });

    it('should navigate to organization page when organization clicked', async () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
        };

        (useUser as any).mockReturnValue({user: mockUser, loading: false});
        (useSignOut as any).mockReturnValue({signOut: vi.fn()});

        render(<UserButton/>);

        const avatar = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(avatar);

        await waitFor(() => {
            expect(screen.getByText('organization')).toBeInTheDocument();
        });

        const orgLink = screen.getByText('organization');
        await user.click(orgLink);

        expect(mockPush).toHaveBeenCalledWith('/dashboard/organization-profile');
    });

    it('should call signOut when sign out clicked', async () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
        };
        const mockSignOut = vi.fn();

        (useUser as any).mockReturnValue({user: mockUser, loading: false});
        (useSignOut as any).mockReturnValue({signOut: mockSignOut});

        render(<UserButton/>);

        const avatar = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(avatar);

        await waitFor(() => {
            expect(screen.getByText('sign_out')).toBeInTheDocument();
        });

        const signOutButton = screen.getByText('sign_out');
        await user.click(signOutButton);

        expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
});
