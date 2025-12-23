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

import type { VariantProps } from 'class-variance-authority';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/Helpers';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const Label = ({ ref, className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
  & VariantProps<typeof labelVariants> & { ref?: React.RefObject<React.ElementRef<typeof LabelPrimitive.Root> | null> }) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
