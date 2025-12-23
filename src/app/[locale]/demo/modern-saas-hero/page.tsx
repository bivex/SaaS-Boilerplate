/**
 * Demo page for the Modern SaaS Hero component
 * Available at /demo/modern-saas-hero route
 */

import { setRequestLocale } from 'next-intl/server';
import { ModernSaaSHero } from '@/templates/ModernSaaSHero';

export default async function ModernSaaSHeroDemoPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen">
      <ModernSaaSHero />
    </div>
  );
}
