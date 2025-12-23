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

import { auth } from '@/libs/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CenteredLayout(props: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {props.children}
    </div>
  );
}
