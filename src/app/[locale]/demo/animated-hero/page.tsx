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

import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

// Lazy load the heavy animated hero component
const Hero = dynamic(() => import('@/components/ui/animated-hero').then(mod => ({ default: mod.Hero })), {
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading demo...</div>,
});

function HeroDemo() {
  return (
    <div className="block">
      <Hero />
    </div>
  );
}

export default async function AnimatedHeroDemoPage(props: Readonly<{ params: Promise<{ locale: string }> }>) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen">
      <HeroDemo />
    </div>
  );
}
