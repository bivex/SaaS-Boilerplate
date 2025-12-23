/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:53:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { withAuth } from '@workos-inc/authkit-nextjs';
import { getTranslations } from 'next-intl/server';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const UserProfilePage = async () => {
  const { user } = await withAuth({ ensureSignedIn: true });
  const params = await { locale: 'en' }; // This would come from props in a real app
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'UserProfile',
  });

  if (!user) {
    return null;
  }

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Your account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <p className="text-sm">{user.firstName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <p className="text-sm">{user.lastName || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-sm">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                User ID
              </label>
              <p className="text-sm font-mono">{user.id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email Verified
              </label>
              <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                {user.emailVerified ? 'Verified' : 'Not Verified'}
              </Badge>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created At
              </label>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserProfilePage;
