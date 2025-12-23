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
import * as React from 'react';

import { cn } from '@/utils/Helpers';

import { buttonVariants } from './buttonVariants';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const Button = ({ ref, className, variant, size, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
};
Button.displayName = 'Button';

export { Button };
