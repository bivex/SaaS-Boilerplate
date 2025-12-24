/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:01:02
 * Last Updated: 2025-12-24T01:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

/**
 * Demo page for the Modern SaaS Wireframe 2025 component
 * Available at /demo/modern-saas-wireframe-2025 route
 */

import { setRequestLocale } from 'next-intl/server';
import { ModernSaaSWireframe2025 } from '@/templates/ModernSaaSWireframe2025';

export default async function ModernSaaSWireframe2025DemoPage(props: Readonly<{ params: Promise<{ locale: string }> }>) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen">
      <ModernSaaSWireframe2025 />
    </div>
  );
}
