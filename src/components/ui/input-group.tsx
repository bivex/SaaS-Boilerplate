/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:00:54
 * Last Updated: 2025-12-24T01:03:43
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import * as React from 'react';

import { cn } from '@/utils/Helpers';

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex w-full rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      className,
    )}
    {...props}
  />
));
InputGroup.displayName = 'InputGroup';

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center px-3 text-muted-foreground',
      className,
    )}
    {...props}
  />
));
InputGroupAddon.displayName = 'InputGroupAddon';

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'flex items-center px-3 text-muted-foreground text-sm',
      className,
    )}
    {...props}
  />
));
InputGroupText.displayName = 'InputGroupText';

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    maxLength?: number;
    showCount?: boolean;
  }
>(({ className, maxLength, showCount, ...props }, ref) => {
  const [charCount, setCharCount] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      {showCount && maxLength && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {charCount}
          /
          {maxLength}
        </div>
      )}
    </div>
  );
});
InputGroupTextarea.displayName = 'InputGroupTextarea';

export { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea };
