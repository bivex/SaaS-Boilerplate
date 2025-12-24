/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:01:02
 * Last Updated: 2025-12-23T19:08:18
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

/**
 * Demo page for the Testimonials component
 * Available at /demo route
 */

import { setRequestLocale } from 'next-intl/server';
import { TestimonialsSection } from '@/components/ui/testimonial-v2';

export default async function DemoPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Testimonials Component Demo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Scroll down to see the animated testimonials section in action
          </p>
        </div>
        <TestimonialsSection />
      </div>
    </div>
  );
}
