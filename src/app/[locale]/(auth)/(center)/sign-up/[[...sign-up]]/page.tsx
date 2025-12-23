/**
 * Copyright (c) 2025 Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:47:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { getSignUpUrl } from '@workos-inc/authkit-nextjs';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

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

const SignUpPage = async () => {
  const signUpUrl = await getSignUpUrl();
  redirect(signUpUrl);
};

export default SignUpPage;
