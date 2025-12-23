/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T17:07:04
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredMenu } from '@/features/landing/CenteredMenu';
import { Section } from '@/features/landing/Section';

import { Logo } from './Logo';

export const Navbar = () => {
  const t = useTranslations('Navbar');

  const logo = useMemo(() => <Logo />, []);
  const rightMenu = useMemo(() => (
    <>
      <li data-fade>
        <ThemeToggle />
      </li>
      <li data-fade>
        <LocaleSwitcher />
      </li>
      <li className="ml-1 mr-2.5" data-fade>
        <Link href="/sign-in">{t('sign_in')}</Link>
      </li>
      <li>
        <Link className={buttonVariants()} href="/sign-up">
          {t('sign_up')}
        </Link>
      </li>
    </>
  ), [t]);
  const menuItems = useMemo(() => (
    <>
      <li>
        <Link href="/sign-up">{t('product')}</Link>
      </li>
      <li>
        <Link href="/sign-up">{t('docs')}</Link>
      </li>
      <li>
        <Link href="/sign-up">{t('blog')}</Link>
      </li>
      <li>
        <Link href="/sign-up">{t('community')}</Link>
      </li>
      <li>
        <Link href="/sign-up">{t('company')}</Link>
      </li>
    </>
  ), [t]);

  return (
    <Section className="px-3 py-6">
      <CenteredMenu
        logo={logo}
        rightMenu={rightMenu}
      >
        {menuItems}
      </CenteredMenu>
    </Section>
  );
};
