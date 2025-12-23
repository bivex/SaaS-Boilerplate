/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T12:00:00
 * Last Updated: 2025-12-23T12:00:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { useState } from 'react';

import { Background } from '@/components/Background';
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

export const UIComponents = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Background>
      <Section
        subtitle="Shadcn UI Components"
        title="Beautiful UI Components"
        description="Explore the power of Shadcn UI components with interactive examples"
      >
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Badge Components */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Badge Components</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          <Separator />

          {/* Tooltip Components */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Tooltip Components</h3>
            <TooltipProvider>
              <div className="flex gap-4">
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
          </div>

          <Separator />

          {/* Form Components */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Form Components</h3>
            <div className="grid gap-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
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
            </div>
          </div>

          <Separator />

          {/* Accordion Component */}
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
        </div>
      </Section>
    </Background>
  );
};
