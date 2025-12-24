/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T20:44:52
 * Last Updated: 2025-12-24T01:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Lazy load the floating header component
const FloatingHeader = dynamic(() => import('@/components/ui/floating-header').then(mod => ({ default: mod.FloatingHeader })), {
  loading: () => <div className="min-h-screen flex items-center justify-center">Loading demo...</div>,
});

export default function DemoOne() {
  return (
    <div className="relative w-full px-4">
      <FloatingHeader />
      <div className="min-h-screen py-10" />

      {/* Dots */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 -z-10 size-full',
          'bg-[radial-gradient(color-mix(in_oklab,--theme(--color-foreground/.5)30%,transparent)_2px,transparent_2px)]',
          'bg-[size:12px_12px]',
        )}
      />
    </div>
  );
}
