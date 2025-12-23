/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:52:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { withAuth } from '@workos-inc/authkit-nextjs';
import { getTranslations } from 'next-intl/server';

import { DashboardHeader } from '@/features/dashboard/DashboardHeader';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function DashboardLayout(props: { children: React.ReactNode }) {
  // Get the authenticated user
  const { user } = await withAuth({ ensureSignedIn: true });

  const params = await { locale: 'en' }; // TODO: Fix params passing from layout
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'DashboardLayout',
  });

  return (
    <>
      <div className="shadow-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-3 py-4">
          <DashboardHeader
            menu={[
              {
                href: '/dashboard',
                label: t('home'),
              },
              // PRO: Link to the /dashboard/todos page
              {
                href: '/dashboard/organization-profile/organization-members',
                label: t('members'),
              },
              {
                href: '/dashboard/organization-profile',
                label: t('settings'),
              },
              // PRO: Link to the /dashboard/billing page
            ]}
            user={user}
          />
        </div>
      </div>

      <div className="min-h-[calc(100vh-72px)] bg-muted">
        <div className="mx-auto max-w-screen-xl px-3 pb-16 pt-6">
          {props.children}
        </div>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';
