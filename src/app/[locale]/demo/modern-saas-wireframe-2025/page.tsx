/**
 * Demo page for the Modern SaaS Wireframe 2025 component
 * Available at /demo/modern-saas-wireframe-2025 route
 */

import { setRequestLocale } from 'next-intl/server';
import { ModernSaaSWireframe2025 } from '@/templates/ModernSaaSWireframe2025';

export default async function ModernSaaSWireframe2025DemoPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen">
      <ModernSaaSWireframe2025 />
    </div>
  );
}
