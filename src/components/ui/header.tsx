/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:15:55
 * Last Updated: 2025-12-24T01:03:42
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { Menu, MoveRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

function Header1() {
  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      description: '',
    },
    {
      title: 'Product',
      description: 'Managing a small business today is already tough.',
      items: [
        {
          title: 'Reports',
          href: '/reports',
        },
        {
          title: 'Statistics',
          href: '/statistics',
        },
        {
          title: 'Dashboards',
          href: '/dashboards',
        },
        {
          title: 'Recordings',
          href: '/recordings',
        },
      ],
    },
    {
      title: 'Company',
      description: 'Managing a small business today is already tough.',
      items: [
        {
          title: 'About us',
          href: '/about',
        },
        {
          title: 'Fundraising',
          href: '/fundraising',
        },
        {
          title: 'Investors',
          href: '/investors',
        },
        {
          title: 'Contact us',
          href: '/contact',
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="w-full z-[60] fixed top-0 left-0 bg-background border-b border-border shadow-lg">
      <div
        className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center"
      >
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              {navigationItems.map(item => (
                <NavigationMenuItem key={item.title}>
                  {item.href
                    ? (
                        <>
                          <NavigationMenuLink asChild>
                            <Link href={item.href}>
                              <Button variant="ghost">{item.title}</Button>
                            </Link>
                          </NavigationMenuLink>
                        </>
                      )
                    : (
                        <>
                          <NavigationMenuTrigger className="font-medium text-sm">
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="!w-[450px] p-4">
                            <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                              <div className="flex flex-col h-full justify-between">
                                <div className="flex flex-col">
                                  <p className="text-base">{item.title}</p>
                                  <p className="text-muted-foreground text-sm">
                                    {item.description}
                                  </p>
                                </div>
                                <Link href="/contact">
                                  <Button size="sm" className="mt-10">
                                    Book a call today
                                  </Button>
                                </Link>
                              </div>
                              <div className="flex flex-col text-sm h-full justify-end">
                                {item.items?.map(subItem => (
                                  <NavigationMenuLink
                                    key={subItem.title}
                                    className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                                    asChild
                                  >
                                    <Link href={subItem.href}>
                                      <span>{subItem.title}</span>
                                      <MoveRight
                                        className="w-4 h-4 text-muted-foreground"
                                      />
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </>
                      )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex lg:justify-center">
          <Link href="/" className="font-semibold hover:opacity-80 transition-opacity">
            Saas Dev
          </Link>
        </div>
        <div className="flex justify-end w-full gap-4">
          <ThemeToggle />
          <Link href="/contact">
            <Button variant="ghost" className="hidden md:inline">
              Book a demo
            </Button>
          </Link>
          <div className="border-r hidden md:inline"></div>
          <Link href="/sign-in">
            <Button variant="outline">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get started</Button>
          </Link>
        </div>
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div
              className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8"
            >
              {navigationItems.map(item => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href
                      ? (
                          <Link
                            href={item.href}
                            className="flex justify-between items-center"
                          >
                            <span className="text-lg">{item.title}</span>
                            <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                          </Link>
                        )
                      : (
                          <p className="text-lg">{item.title}</p>
                        )}
                    {item.items?.map(subItem => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex justify-between items-center"
                      >
                        <span className="text-muted-foreground">
                          {subItem.title}
                        </span>
                        <MoveRight className="w-4 h-4 stroke-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header1 };
