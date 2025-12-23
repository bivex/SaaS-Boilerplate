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

import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Footer } from '@/components/ui/footer-section';
import { Header1 } from '@/components/ui/header';
import { TestimonialsSection } from '@/components/ui/testimonial-v2';
import { CTA } from '@/templates/CTA';
import { DemoBanner } from '@/templates/DemoBanner';
import { FAQ } from '@/templates/FAQ';
import { Features } from '@/templates/Features';
import { Hero } from '@/templates/Hero';
import { Pricing } from '@/templates/Pricing';
import { Sponsors } from '@/templates/Sponsors';
import { UIComponents } from '@/templates/UIComponents';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
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
