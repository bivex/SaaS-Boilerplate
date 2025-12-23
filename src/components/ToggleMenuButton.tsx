/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T17:24:48
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { ComponentPropsWithoutRef, ElementRef } from 'react';

import { Button } from '@/components/ui/button';

/**
 * A toggle button to show/hide component in small screen.
 * @component
 * @params props - Component props.
 * @params props.onClick - Function to run when the button is clicked.
 */
const ToggleMenuButton = ({ ref, ...props }: ComponentPropsWithoutRef<typeof Button> & { ref?: React.RefObject<ElementRef<typeof Button> | null> }) => (
  <Button
    className="p-2 focus-visible:ring-offset-0"
    variant="ghost"
    ref={ref}
    {...props}
  >
    <svg
      className="size-6 stroke-current"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </Button>
);

export { ToggleMenuButton };
