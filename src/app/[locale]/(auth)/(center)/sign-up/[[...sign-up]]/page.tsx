/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T17:24:49
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { SignUp } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

import { getI18nPath } from '@/utils/Helpers';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignUpPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  return (
    <SignUp
      path={getI18nPath('/sign-up', params.locale)}
      routing="path"
      signInUrl={getI18nPath('/sign-in', params.locale)}
      forceRedirectUrl={getI18nPath('/dashboard', params.locale)}
    />
  );
};

export default SignUpPage;
