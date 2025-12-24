/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-24T01:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { LangSetter } from '@/components/LangSetter';
import { LocaleSwitcher, SessionRefresher } from '@/components/LocaleSwitcher';
import { AllLocales } from '@/utils/AppConfig';

export function generateStaticParams() {
  return AllLocales.map(locale => ({ locale }));
}

export default async function LocaleLayout(props: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const params = await props.params;
  setRequestLocale(params.locale);

  // Using internationalization in Client Components
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      locale={params.locale}
      messages={messages}
    >
      <LangSetter locale={params.locale} />
      <SessionRefresher />
      <main>
        {props.children}
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <LocaleSwitcher />
      </div>
    </NextIntlClientProvider>
  );
}
