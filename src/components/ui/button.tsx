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

import type { VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '@/utils/Helpers';

import { buttonVariants } from './buttonVariants';

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const Button = ({ ref, className, variant, size, asChild = false, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
};
Button.displayName = 'Button';

export { Button };
