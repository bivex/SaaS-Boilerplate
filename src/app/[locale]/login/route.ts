/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:46:00
 * Last Updated: 2025-12-23T19:46:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export const GET = async () => {
  const signInUrl = await getSignInUrl();

  return redirect(signInUrl);
};
