/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T05:45:00
 * Last Updated: 2025-12-24T05:45:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ContactForm } from '@/components/ContactForm';
import { Section } from '@/features/landing/Section';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Contact',
  });

  return {
    title: t('meta_title') || 'Contact Us',
    description: t('meta_description') || 'Get in touch with us. We\'d love to hear from you.',
  };
}

const ContactPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <Section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or need help? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
};

export default ContactPage;
