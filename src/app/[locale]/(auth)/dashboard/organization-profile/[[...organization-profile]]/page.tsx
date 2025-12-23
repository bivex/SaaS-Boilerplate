/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T17:07:04
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { OrganizationProfile } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { getI18nPath } from '@/utils/Helpers';

const OrganizationProfilePage = (props: { params: Promise<{ locale: string }> }) => {
  const [params, setParams] = useState<{ locale: string } | null>(null);
  const t = useTranslations('OrganizationProfile');

  useEffect(() => {
    props.params.then(setParams);
  }, [props.params]);

  if (!params) {
    return null;
  }

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <OrganizationProfile
        routing="path"
        path={getI18nPath(
          '/dashboard/organization-profile',
          params.locale,
        )}
        afterLeaveOrganizationUrl="/onboarding/organization-selection"
        appearance={{
          elements: {
            rootBox: 'w-full',
            cardBox: 'w-full flex',
          },
        }}
      />
    </>
  );
};

export default OrganizationProfilePage;
