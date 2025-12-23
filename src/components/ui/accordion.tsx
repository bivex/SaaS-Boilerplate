/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T17:25:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/Helpers';

type AccordionProps = {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
};

type AccordionItemProps = {
  value: string;
  children: React.ReactNode;
};

type AccordionTriggerProps = {
  children: React.ReactNode;
  className?: string;
  value?: string;
};

type AccordionContentProps = {
  children: React.ReactNode;
  className?: string;
  value?: string;
};

const AccordionContext = React.createContext<{
  type: 'single' | 'multiple';
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  collapsible = false,
  className,
  children,
  ...props
}) => {
  const [value, setValue] = React.useState<string>('');

  const handleValueChange = React.useCallback((newValue: string) => {
    if (type === 'single') {
      setValue(newValue === value && collapsible ? '' : newValue);
    }
  }, [type, value, collapsible]);

  return (
    <AccordionContext value={{ type, value, onValueChange: handleValueChange }}>
      <div className={cn('', className)} {...props}>
        {children}
      </div>
    </AccordionContext>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({ value, children }) => {
  const context = React.use(AccordionContext);
  const isOpen = context?.value === value;

  return (
    <div className="border-b">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            'data-state': isOpen ? 'open' : 'closed',
            value,
          });
        }
        return child;
      })}
    </div>
  );
};

const AccordionTrigger = ({ ref, className, children, ...props }: AccordionTriggerProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  const context = React.use(AccordionContext);
  const itemValue = props.value;

  const handleClick = () => {
    context?.onValueChange?.(itemValue || '');
  };

  return (
    <button
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  );
};
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = ({ ref, className, children, ...props }: AccordionContentProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const context = React.use(AccordionContext);
  const itemValue = props.value;
  const isOpen = context?.value === itemValue;

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden text-sm transition-all',
        isOpen ? 'animate-accordion-down' : 'animate-accordion-up',
        className,
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
};
AccordionContent.displayName = 'AccordionContent';

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
};
