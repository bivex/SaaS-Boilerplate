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

import { cn } from '@/utils/Helpers';

export const Section = (props: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}) => (
  <div className={cn('px-3 py-16', props.className)}>
    {(props.title || props.subtitle || props.description) && (
      <div className="mx-auto mb-12 max-w-screen-md text-center">
        {props.subtitle && (
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-sm font-bold text-transparent">
            {props.subtitle}
          </div>
        )}

        {props.title && (
          <div className="mt-1 text-3xl font-bold">{props.title}</div>
        )}

        {props.description && (
          <div className="mt-2 text-lg text-muted-foreground">
            {props.description}
          </div>
        )}
      </div>
    )}

    <div className="mx-auto max-w-screen-lg">{props.children}</div>
  </div>
);
