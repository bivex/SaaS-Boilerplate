/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-18T21:10:35
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { UserProfile } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { use } from 'react';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { getI18nPath } from '@/utils/Helpers';

const UserProfilePage = (props: { params: Promise<{ locale: string }> }) => {
  const params = use(props.params);
  const t = useTranslations('UserProfile');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <UserProfile
        routing="path"
        path={getI18nPath('/dashboard/user-profile', params.locale)}
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

export default UserProfilePage;
