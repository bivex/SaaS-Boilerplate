/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T20:10:00
 * Last Updated: 2025-12-23T20:10:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use server';

import { signOut } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  // Temporarily disable WorkOS signOut to test
  // await signOut();
  console.log('Sign out called');
  redirect('/');
}
