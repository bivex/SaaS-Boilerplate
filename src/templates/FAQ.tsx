/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T19:01:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { useTranslations } from 'next-intl';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Section } from '@/features/landing/Section';

export const FAQ = () => {
  const t = useTranslations('FAQ');

  return (
    <Section>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t('question')}</AccordionTrigger>
          <AccordionContent>{t('answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{t('question')}</AccordionTrigger>
          <AccordionContent>{t('answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>{t('question')}</AccordionTrigger>
          <AccordionContent>{t('answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>{t('question')}</AccordionTrigger>
          <AccordionContent>{t('answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>{t('question')}</AccordionTrigger>
          <AccordionContent>{t('answer')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>{t('question')}</AccordionTrigger>
          <AccordionContent>{t('answer')}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  );
};
