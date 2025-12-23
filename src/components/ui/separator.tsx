/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T16:53:34
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import * as React from 'react';

import { cn } from '@/utils/Helpers';

type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical';
} & React.HTMLAttributes<HTMLDivElement>;

const Separator = ({ ref, className, orientation = 'horizontal', ...props }: SeparatorProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div
    ref={ref}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
);
Separator.displayName = 'Separator';

export { Separator };
