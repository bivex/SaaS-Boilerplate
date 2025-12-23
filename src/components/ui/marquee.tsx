/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:24:02
 * Last Updated: 2025-12-23T20:44:54
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

type MarqueeProps = {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  speed?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function Marquee({
  children,
  pauseOnHover = false,
  direction = 'left',
  speed = 30,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden sm:mt-24 mt-10 z-10',
        className,
      )}
      {...props}
    >
      <div className="relative flex max-w-[90vw] overflow-hidden py-5">
        <div
          className={cn(
            'flex w-max animate-marquee',
            pauseOnHover && 'hover:[animation-play-state:paused]',
            direction === 'right' && 'animate-marquee-reverse',
          )}
          style={{ '--duration': `${speed}s` } as React.CSSProperties}
        >
          {children}
          {children}
        </div>
      </div>
    </div>
  );
}
