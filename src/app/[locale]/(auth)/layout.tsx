/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:04:09
 * Last Updated: 2025-12-23T19:55:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Add AuthKitProvider only for authenticated routes
  return (
    <AuthKitProvider>
      {props.children}
    </AuthKitProvider>
  );
}
