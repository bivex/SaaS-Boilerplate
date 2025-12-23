/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T22:55:00
 * Last Updated: 2025-12-23T22:55:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { Building2, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/hooks/useAuth';
import { getI18nPath } from '@/utils/Helpers';

type OrganizationSwitcherProps = {
  hidePersonal?: boolean;
};

export function OrganizationSwitcher({ hidePersonal = true }: OrganizationSwitcherProps) {
  const { session, loading } = useSession();
  const t = useTranslations('OrganizationSwitcher');
  const router = useRouter();

  if (loading) {
    return (
      <Button variant="ghost" disabled className="max-w-28 sm:max-w-52">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </Button>
    );
  }

  const organizations = session?.user?.organizations || [];
  const activeOrg = session?.organization;

  if (!activeOrg && organizations.length === 0) {
    return (
      <Button
        variant="ghost"
        onClick={() => router.push('/onboarding/organization-selection')}
        className="max-w-28 sm:max-w-52"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('create_org')}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="max-w-28 sm:max-w-52 justify-start px-2"
        >
          <Building2 className="mr-2 h-4 w-4" />
          <span className="truncate">
            {activeOrg?.name || t('personal')}
          </span>
          {activeOrg && (
            <Badge variant="secondary" className="ml-2">
              {activeOrg.role}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <DropdownMenuLabel>{t('organizations')}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!hidePersonal && (
          <DropdownMenuItem
            onClick={() => {
              // Switch to personal account
              router.push('/dashboard');
            }}
          >
            <Building2 className="mr-2 h-4 w-4" />
            {t('personal')}
          </DropdownMenuItem>
        )}

        {organizations.map((org: any) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => {
              // Switch organization logic would go here
              router.push('/dashboard');
            }}
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span className="truncate">{org.name}</span>
            {org.id === activeOrg?.id && (
              <Badge variant="secondary" className="ml-auto">
                {org.role}
              </Badge>
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(getI18nPath('/dashboard/organization-profile', 'en'))}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('manage_orgs')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
