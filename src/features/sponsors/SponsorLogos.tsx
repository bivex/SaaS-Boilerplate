/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:25:50
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

// import Image from 'next/image'; // Using regular img tags for marquee compatibility
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
        className="h-[37px] w-auto dark:invert"
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
        className="h-[26px] w-auto dark:invert"
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
        className="h-[38px] w-auto dark:invert"
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
        className="h-[56px] w-auto dark:invert"
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
        className="h-[30px] w-auto"
      />
    </a>
  ),
};

export const SponsorLogos = () => {
  const sponsorLogos = [
    Logos.clerk,
    Logos.crowdin,
    Logos.sentry,
    Logos.arcjet,
    Logos.nextjsSaaS,
  ];

  return (
    <Marquee pauseOnHover={true} speed={25}>
      {sponsorLogos.map((Logo, index) => (
        <div
          key={index}
          className="relative h-full w-fit mx-[3rem] flex items-center justify-start"
        >
          <Logo />
        </div>
      ))}
    </Marquee>
  );
};