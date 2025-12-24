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

import { Marquee } from '@/components/ui/marquee';

const Logos = {
  clerk: () => (
    <a
      href="https://clerk.com?utm_source=github&utm_medium=sponsorship&utm_campaign=nextjs-boilerplate"
      target="_blank"
      rel="noopener"
      className="flex items-center"
    >
      <img
        src="/assets/images/clerk-logo-dark.png"
        alt="Clerk logo"
        width="110"
        height="32"
        className="h-8 w-auto object-contain dark:invert"
        loading="lazy"
      />
    </a>
  ),
  crowdin: () => (
    <a
      href="https://l.crowdin.com/next-js"
      target="_blank"
      rel="noopener"
      className="flex items-center"
    >
      <img
        src="/assets/images/crowdin-dark.png"
        alt="Crowdin logo"
        width="128"
        height="26"
        className="h-8 w-auto object-contain dark:invert"
        loading="lazy"
      />
    </a>
  ),
  sentry: () => (
    <a
      href="https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo"
      target="_blank"
      rel="noopener"
      className="flex items-center"
    >
      <img
        src="/assets/images/sentry-dark.png"
        alt="Sentry logo"
        width="100"
        height="30"
        className="h-8 w-auto object-contain dark:invert"
        loading="lazy"
      />
    </a>
  ),
  arcjet: () => (
    <a
      href="https://launch.arcjet.com/Q6eLbRE"
      target="_blank"
      rel="noopener"
      className="flex items-center"
    >
      <img
        src="/assets/images/arcjet-light.svg"
        alt="Arcjet logo"
        width="120"
        height="40"
        className="h-[40px] w-auto object-contain dark:invert"
        loading="lazy"
      />
    </a>
  ),
  nextjsSaaS: () => (
    <a
      href="https://nextjs-boilerplate.com/pro-saas-starter-kit"
      target="_blank"
      rel="noopener"
      className="flex items-center"
    >
      <img
        src="/assets/images/nextjs-boilerplate-saas.png"
        alt="Nextjs SaaS Boilerplate"
        width="150"
        height="35"
        className="h-8 w-auto object-contain"
        loading="lazy"
      />
    </a>
  ),
};

export const SponsorLogos = () => {
  const sponsorLogos = [
    { component: Logos.clerk, key: 'clerk' },
    { component: Logos.crowdin, key: 'crowdin' },
    { component: Logos.sentry, key: 'sentry' },
    { component: Logos.arcjet, key: 'arcjet' },
    { component: Logos.nextjsSaaS, key: 'nextjsSaaS' },
  ];

  return (
    <Marquee pauseOnHover={true} speed={25}>
      {sponsorLogos.map(({ component: Logo, key }) => (
        <div
          key={key}
          className="relative h-12 w-fit mx-8 flex items-center justify-start"
        >
          <Logo />
        </div>
      ))}
    </Marquee>
  );
};
