/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T12:00:00
 * Last Updated: 2025-12-23T17:24:48
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { memo, useCallback, useState } from 'react';

import { Background } from '@/components/Background';
import { CSSDebugger } from '@/components/CSSDebugger';
import { ProfileForm } from '@/components/ExampleForm';
import { ThemeDemo } from '@/components/ThemeDemo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Section } from '@/features/landing/Section';

// Memoized Theme Demonstration Component
const ThemeDemoSection = memo(() => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold">Theme Support</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-lg border bg-card">
        <h4 className="text-lg font-semibold mb-3 text-card-foreground">Light Theme Colors</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-background border"></div>
            <span className="text-sm">Background</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-foreground"></div>
            <span className="text-sm">Foreground</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span className="text-sm">Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary"></div>
            <span className="text-sm">Secondary</span>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg border bg-card">
        <h4 className="text-lg font-semibold mb-3 text-card-foreground">Dark Theme Colors</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-900 border border-slate-700"></div>
            <span className="text-sm">Dark Background</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-100"></div>
            <span className="text-sm">Dark Foreground</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-sm">Dark Primary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-800"></div>
            <span className="text-sm">Dark Secondary</span>
          </div>
        </div>
      </div>
    </div>
  </div>
));
ThemeDemoSection.displayName = 'ThemeDemoSection';

// Memoized Badge Components Section
const BadgeSection = memo(() => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold">Badge Components</h3>
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
    <p className="text-sm text-muted-foreground">
      All badges automatically adapt to light and dark themes using CSS custom properties.
    </p>
  </div>
));
BadgeSection.displayName = 'BadgeSection';

// Memoized Button Variants Section
const ButtonSection = memo(() => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold">Button Variants</h3>
    <div className="flex flex-wrap gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
    <div className="flex flex-wrap gap-3 mt-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  </div>
));
ButtonSection.displayName = 'ButtonSection';

// Memoized Tooltip Components Section
const TooltipSection = memo(() => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold">Tooltip Components</h3>
    <TooltipProvider>
      <div className="flex gap-4 flex-wrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a tooltip!</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">Info</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get more information about this feature</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive">Danger</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Warning: This action cannot be undone</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
    <p className="text-sm text-muted-foreground">
      Tooltips provide contextual information and adapt to theme colors.
    </p>
  </div>
));
TooltipSection.displayName = 'TooltipSection';

// Memoized Form Components Section
const FormSection = memo(({ inputValue, onInputChange }: {
  inputValue: string;
  onInputChange: (value: string) => void;
}) => (
  <div className="space-y-8">
    <div>
      <h3 className="text-2xl font-bold mb-4">Form Components</h3>
      <div className="grid gap-4 max-w-md mb-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            placeholder="Enter your message"
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Basic form inputs automatically style themselves based on the current theme.
      </p>
    </div>

    <div>
      <h4 className="text-xl font-semibold mb-4">Advanced Form with Validation</h4>
      <div className="max-w-lg">
        <ProfileForm />
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        This form demonstrates React Hook Form integration with Zod validation, type safety, and proper accessibility.
      </p>
    </div>
  </div>
));
FormSection.displayName = 'FormSection';

// Memoized CSS Debug Section
const CSSDebugSection = memo(() => {
  const [showGrid, setShowGrid] = useState(false);
  const [showOutlines, setShowOutlines] = useState(false);
  const [showBreakpoints, setShowBreakpoints] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">CSS Debug Tools</h3>
      <div className="flex flex-wrap gap-4 p-6 border rounded-lg bg-card">
        <div className="space-y-3">
          <h4 className="font-semibold">Debug Controls</h4>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={e => setShowGrid(e.target.checked)}
                className="rounded"
              />
              <span>Show Grid Overlay</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOutlines}
                onChange={e => setShowOutlines(e.target.checked)}
                className="rounded"
              />
              <span>Show Element Outlines</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showBreakpoints}
                onChange={e => setShowBreakpoints(e.target.checked)}
                className="rounded"
              />
              <span>Show Breakpoint Indicator</span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Console Commands</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              <code className="bg-muted px-1 rounded">DebugUtils.logThemeVars()</code>
              {' '}
              - Log theme variables
            </div>
            <div>
              <code className="bg-muted px-1 rounded">DebugUtils.toggleGrid()</code>
              {' '}
              - Toggle grid
            </div>
            <div>
              <code className="bg-muted px-1 rounded">DebugUtils.toggleOutlines()</code>
              {' '}
              - Toggle outlines
            </div>
            <div>
              <code className="bg-muted px-1 rounded">DebugUtils.debugElement('.selector')</code>
              {' '}
              - Debug element
            </div>
          </div>
        </div>
      </div>

      <CSSDebugger
        showGrid={showGrid}
        showOutlines={showOutlines}
        showBreakpoints={showBreakpoints}
      />
    </div>
  );
});
CSSDebugSection.displayName = 'CSSDebugSection';

// Memoized Card Components Section
const CardSection = memo(() => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold">Card Components</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-lg border bg-card text-card-foreground">
        <h4 className="text-lg font-semibold mb-2">Sample Card</h4>
        <p className="text-sm text-muted-foreground mb-4">
          This card automatically adapts to light and dark themes.
          The background, text, and border colors change based on your theme preference.
        </p>
        <Button size="sm">Learn More</Button>
      </div>

      <div className="p-6 rounded-lg border bg-card text-card-foreground">
        <h4 className="text-lg font-semibold mb-2">Theme Aware</h4>
        <p className="text-sm text-muted-foreground mb-4">
          All Shadcn UI components use CSS custom properties that automatically
          switch between light and dark values.
        </p>
        <div className="flex gap-2">
          <Badge variant="secondary">Light</Badge>
          <Badge variant="secondary">Dark</Badge>
        </div>
      </div>
    </div>
  </div>
));
CardSection.displayName = 'CardSection';

// Memoized Accordion Component Section
const AccordionSection = memo(() => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold">Accordion Component</h3>
    <Accordion type="single" collapsible className="w-full max-w-2xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Shadcn UI?</AccordionTrigger>
        <AccordionContent>
          Shadcn UI is a collection of reusable components built on top of Radix UI and styled with Tailwind CSS.
          It provides beautiful, accessible components that you can copy and paste into your apps.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>How do I install Shadcn UI?</AccordionTrigger>
        <AccordionContent>
          You can install Shadcn UI components using the CLI. Run `npx shadcn-ui@latest add [component-name]`
          to add components to your project. The components will be installed in your `components/ui` directory.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Can I customize the components?</AccordionTrigger>
        <AccordionContent>
          Yes! All Shadcn UI components are built with Tailwind CSS classes and can be easily customized.
          You can modify the component styles, add new variants, or extend the existing ones to match your design system.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>Is Shadcn UI free?</AccordionTrigger>
        <AccordionContent>
          Yes, Shadcn UI is completely free and open source. You can use it in personal and commercial projects
          without any licensing fees. The components are designed to be copied and modified as needed.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
));
AccordionSection.displayName = 'AccordionSection';

// Main UIComponents component with optimized state management
const UIComponentsComponent = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  return (
    <Background>
      <Section
        subtitle="Shadcn UI Components"
        title="Beautiful UI Components"
        description="Explore the power of Shadcn UI components with interactive examples"
      >
        <div className="mx-auto max-w-4xl space-y-12">
          <ThemeDemoSection />
          <Separator />
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Tailwind CSS 4 Theme Demo</h3>
            <ThemeDemo />
          </div>
          <Separator />
          <CSSDebugSection />
          <Separator />
          <BadgeSection />
          <Separator />
          <ButtonSection />
          <Separator />
          <TooltipSection />
          <Separator />
          <FormSection inputValue={inputValue} onInputChange={handleInputChange} />
          <Separator />
          <CardSection />
          <Separator />
          <AccordionSection />
        </div>
      </Section>
    </Background>
  );
};

export const UIComponents = memo(UIComponentsComponent);
