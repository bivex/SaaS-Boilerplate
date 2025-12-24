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

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
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

const OrganizationSelectionPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    {/* TODO: Implement organization selection UI */}
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Organization Setup</h1>
      <p className="text-muted-foreground mb-4">Organization selection will be implemented here.</p>
    </div>
  </div>
);

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
