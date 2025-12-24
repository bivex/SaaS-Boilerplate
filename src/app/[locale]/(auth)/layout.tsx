/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:04:09
 * Last Updated: 2025-12-24T01:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { useEffect, useState } from 'react';

export default function AuthLayout(props: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const [params, setParams] = useState<{ locale: string } | null>(null);

  useEffect(() => {
    props.params.then(setParams);
  }, [props.params]);

  if (!params) {
    return null; // or a loading spinner
  }

  return (
    <>
      {props.children}
    </>
  );
}
