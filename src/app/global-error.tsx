/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T09:43:52
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect, useState } from 'react';

export default function GlobalError(props: {
  error: Error & { digest?: string };
  params: Promise<{ locale: string }>;
}) {
  const [params, setParams] = useState<{ locale: string } | null>(null);

  useEffect(() => {
    props.params.then(setParams);
  }, [props.params]);

  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  if (!params) {
    return null;
  }

  return (
    <html lang={params.locale}>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
