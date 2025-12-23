/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:54:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { withAuth } from '@workos-inc/authkit-nextjs';
import { getTranslations } from 'next-intl/server';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'OrganizationProfile',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const OrganizationProfilePage = async () => {
  const { user } = await withAuth({ ensureSignedIn: true });
  const params = await { locale: 'en' }; // This would come from props in a real app
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'OrganizationProfile',
  });

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Organization Management</CardTitle>
            <CardDescription>
              Manage your organization settings and members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              WorkOS AuthKit provides organization management through hosted pages.
              Organization settings and member management are handled directly through WorkOS.
            </p>

            <div className="pt-4">
              <p className="text-sm font-medium mb-2">Current User:</p>
              <p className="text-sm">{user?.email}</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                To manage organizations, members, or access the organization settings,
                please visit your WorkOS Dashboard or contact your organization administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OrganizationProfilePage;
