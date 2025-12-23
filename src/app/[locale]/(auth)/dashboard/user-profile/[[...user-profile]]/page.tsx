/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:01:02
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { useUser } from '@/hooks/useAuth';

const UserProfilePage = () => {
  const { user, loading } = useUser();
  const t = useTranslations('UserProfile');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('profile_settings')}</CardTitle>
          <CardDescription>
            {t('manage_account')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={user.name || ''}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {t('profile_note')}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UserProfilePage;
