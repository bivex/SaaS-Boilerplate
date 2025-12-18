/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-18T21:10:35
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import Link from 'next/link';

import { StickyBanner } from '@/features/landing/StickyBanner';

export const DemoBanner = () => (
  <StickyBanner>
    Live Demo of SaaS Boilerplate -
    {' '}
    <Link href="/sign-up">Explore the User Dashboard</Link>
  </StickyBanner>
);
