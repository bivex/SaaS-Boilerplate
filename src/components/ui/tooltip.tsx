/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T16:55:06
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import * as React from 'react';

import { cn } from '@/utils/Helpers';

type TooltipProviderProps = {
  children: React.ReactNode;
  delayDuration?: number;
};

type TooltipProps = {
  children: React.ReactNode;
};

type TooltipTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

type TooltipContentProps = {
  children: React.ReactNode;
  align?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const TooltipProvider: React.FC<TooltipProviderProps> = ({ children, delayDuration: _delayDuration }) => (
  <>{children}</>
);

const Tooltip: React.FC<TooltipProps> = ({ children }) => <>{children}</>;

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children, className, asChild, ...props }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      className: cn((children.props as any).className, className),
    });
  }

  return (
    <div className={cn('inline-block', className)} {...props}>
      {children}
    </div>
  );
};

const TooltipContent: React.FC<TooltipContentProps> = ({ children, className, align: _align, ...props }) => (
  <div
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
