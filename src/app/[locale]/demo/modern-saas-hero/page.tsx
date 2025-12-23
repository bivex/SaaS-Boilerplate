/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:01:02
 * Last Updated: 2025-12-23T19:01:02
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

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
