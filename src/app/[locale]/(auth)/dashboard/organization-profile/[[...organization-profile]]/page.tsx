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

import { TitleBar } from '@/features/dashboard/TitleBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OrganizationProfilePage = () => {
  const t = useTranslations('OrganizationProfile');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('organization_settings')}</CardTitle>
          <CardDescription>
            {t('manage_organization')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {t('organization_note')}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrganizationProfilePage;
