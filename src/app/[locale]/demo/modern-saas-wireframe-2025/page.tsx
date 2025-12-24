/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:01:02
 * Last Updated: 2025-12-24T02:39:43
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

/**
 * Demo page for the Modern SaaS Wireframe 2025 component
 * Available at /demo/modern-saas-wireframe-2025 route
 */

import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

// Lazy load the heavy demo component
const ModernSaaSWireframe2025 = dynamic(() => import('@/templates/ModernSaaSWireframe2025').then(mod => ({ default: mod.ModernSaaSWireframe2025 })), {
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading demo...</div>,
});

export default async function ModernSaaSWireframe2025DemoPage(props: Readonly<{ params: Promise<{ locale: string }> }>) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen">
      <ModernSaaSWireframe2025 />
    </div>
  );
}
