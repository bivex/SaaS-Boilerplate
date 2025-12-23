/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:43:41
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import Link from 'next/link';

import { signOutAction } from '@/app/actions/auth';

import { ActiveLink } from '@/components/ActiveLink';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ToggleMenuButton } from '@/components/ToggleMenuButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/templates/Logo';

export const DashboardHeader = (props: {
  menu: {
    href: string;
    label: string;
  }[];
  user?: any;
}) => {

  return (
    <>
      <div className="flex items-center">
        <Link href="/dashboard" className="max-sm:hidden">
          <Logo />
        </Link>

        <svg
          className="size-8 stroke-muted-foreground max-sm:hidden"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M17 5 7 19" />
        </svg>

        {/* Organization/Workspace selector would go here if using WorkOS organizations */}

        <nav className="ml-3 max-lg:hidden">
          <ul className="flex flex-row items-center gap-x-3 text-lg font-medium [&_a:hover]:opacity-100 [&_a]:opacity-75">
            {props.menu.map(item => (
              <li key={item.href}>
                <ActiveLink href={item.href}>{item.label}</ActiveLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div>
        <ul className="flex items-center gap-x-1.5 [&_li[data-fade]:hover]:opacity-100 [&_li[data-fade]]:opacity-60">
          <li data-fade>
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ToggleMenuButton />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {props.menu.map(item => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>

          {/* PRO: Dark mode toggle button */}

          <li data-fade>
            <LocaleSwitcher />
          </li>

          <li>
            <Separator orientation="vertical" className="h-4" />
          </li>

          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                  {props.user?.firstName?.charAt(0) || props.user?.email?.charAt(0) || 'U'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{props.user?.firstName || 'Test User'}</div>
                  <div className="text-muted-foreground">{props.user?.email || 'test@example.com'}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/user-profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={signOutAction}>
                    <button type="submit" className="w-full text-left">
                      Sign out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </>
  );
};
