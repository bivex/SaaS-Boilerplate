/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:56:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { withAuth } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const OrganizationSelectionPage = async () => {
  const { user } = await withAuth({ ensureSignedIn: true });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Organization Setup</CardTitle>
          <CardDescription>
            Welcome! Organization management is handled through WorkOS AuthKit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To manage organizations and team members, please visit your WorkOS Dashboard
            or contact your organization administrator.
          </p>

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Continue to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
