/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:01:13
 * Last Updated: 2025-12-23T19:23:58
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

// Critical components - load immediately
import { Header1 } from '@/components/ui/header';
import { Hero } from '@/templates/Hero';

// Lazy load heavy components
const Footer = dynamic(() => import('@/components/ui/footer-section').then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-32 bg-muted animate-pulse" />,
});

const TestimonialsSection = dynamic(() => import('@/components/ui/testimonial-v2').then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => <div className="h-64 bg-muted animate-pulse" />,
});

const CTA = dynamic(() => import('@/templates/CTA').then(mod => ({ default: mod.CTA })), {
  loading: () => <div className="h-32 bg-muted animate-pulse" />,
});

const DemoBanner = dynamic(() => import('@/templates/DemoBanner').then(mod => ({ default: mod.DemoBanner })), {
  loading: () => <div className="h-16 bg-muted animate-pulse" />,
});

const FAQ = dynamic(() => import('@/templates/FAQ').then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="h-48 bg-muted animate-pulse" />,
});

const Features = dynamic(() => import('@/templates/Features').then(mod => ({ default: mod.Features })), {
  loading: () => <div className="h-64 bg-muted animate-pulse" />,
});

const Pricing = dynamic(() => import('@/templates/Pricing').then(mod => ({ default: mod.Pricing })), {
  loading: () => <div className="h-64 bg-muted animate-pulse" />,
});

const Sponsors = dynamic(() => import('@/templates/Sponsors').then(mod => ({ default: mod.Sponsors })), {
  loading: () => <div className="h-32 bg-muted animate-pulse" />,
});

const UIComponents = dynamic(() => import('@/templates/UIComponents').then(mod => ({ default: mod.UIComponents })), {
  loading: () => <div className="h-96 bg-muted animate-pulse" />,
});

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const IndexPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <>
      <DemoBanner />
      <Header1 />
      <Hero />
      <Sponsors />
      <Features />
      <TestimonialsSection />
      <UIComponents />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
};

export default IndexPage;
