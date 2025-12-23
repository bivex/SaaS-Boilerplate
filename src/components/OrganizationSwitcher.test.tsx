/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:30:00
 * Last Updated: 2025-12-23T23:30:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from '@/hooks/useAuth';
import { OrganizationSwitcher } from './OrganizationSwitcher';

// Mock the hooks
vi.mock('@/hooks/useAuth', () => ({
  useSession: vi.fn(),
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

describe('OrganizationSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when session is loading', () => {
    vi.mocked(useSession).mockReturnValue({ session: null, loading: true });

    render(<OrganizationSwitcher />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show create organization button when no organization', () => {
    vi.mocked(useSession).mockReturnValue({
      session: { user: { id: '1', organizations: [] }, organization: null },
      loading: false,
    });

    render(<OrganizationSwitcher />);

    const createButton = screen.getByText('create_org');

    expect(createButton).toBeInTheDocument();

    fireEvent.click(createButton);

    expect(mockPush).toHaveBeenCalledWith('/onboarding/organization-selection');
  });

  it('should show personal account when no active organization', () => {
    vi.mocked(useSession).mockReturnValue({
      session: {
        user: { id: '1', organizations: [] },
        organization: null,
      },
      loading: false,
    });

    render(<OrganizationSwitcher />);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('personal');
  });

  it('should show active organization name', () => {
    const mockOrg = {
      id: 'org-1',
      name: 'Test Organization',
      role: 'admin',
    };

    vi.mocked(useSession).mockReturnValue({
      session: {
        user: { id: '1', organizations: [mockOrg] },
        organization: mockOrg,
      },
      loading: false,
    });

    render(<OrganizationSwitcher />);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Test Organization');
    expect(button).toHaveTextContent('admin');
  });

  it('should show organization dropdown menu', async () => {
    const mockOrg1 = {
      id: 'org-1',
      name: 'Organization 1',
      role: 'admin',
    };
    const mockOrg2 = {
      id: 'org-2',
      name: 'Organization 2',
      role: 'member',
    };

    vi.mocked(useSession).mockReturnValue({
      session: {
        user: { id: '1', organizations: [mockOrg1, mockOrg2] },
        organization: mockOrg1,
      },
      loading: false,
    });

    render(<OrganizationSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('organizations')).toBeInTheDocument();
      expect(screen.getByText('Organization 1')).toBeInTheDocument();
      expect(screen.getByText('Organization 2')).toBeInTheDocument();
      expect(screen.getByText('manage_orgs')).toBeInTheDocument();
    });

    // Check that active org shows badge
    const activeOrg = screen.getByText('Organization 1').closest('div');

    expect(activeOrg).toHaveTextContent('admin');
  });

  it('should navigate to organization profile when manage clicked', async () => {
    vi.mocked(useSession).mockReturnValue({
      session: {
        user: { id: '1', organizations: [] },
        organization: null,
      },
      loading: false,
    });

    render(<OrganizationSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const manageButton = screen.getByText('manage_orgs');
    fireEvent.click(manageButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard/organization-profile');
  });

  it('should hide personal option when hidePersonal is true', () => {
    vi.mocked(useSession).mockReturnValue({
      session: {
        user: { id: '1', organizations: [] },
        organization: null,
      },
      loading: false,
    });

    render(<OrganizationSwitcher hidePersonal />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Personal option should not be in dropdown
    expect(screen.queryByText('personal')).not.toBeInTheDocument();
  });

  it('should show personal option when hidePersonal is false', () => {
    vi.mocked(useSession).mockReturnValue({
      session: {
        user: { id: '1', organizations: [] },
        organization: null,
      },
      loading: false,
    });

    render(<OrganizationSwitcher hidePersonal={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('personal')).toBeInTheDocument();
  });
});
