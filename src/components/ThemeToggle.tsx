/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T09:45:12
 * Last Updated: 2025-12-24T01:03:42
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { Monitor, Moon, Palette, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { memo, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function ThemeToggleComponent() {
  const { setTheme, theme } = useTheme();

  const themes = useMemo(() => [
    {
      name: 'Light',
      value: 'light',
      icon: Sun,
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: Moon,
    },
    {
      name: 'System',
      value: 'system',
      icon: Monitor,
    },
    {
      name: 'Ocean',
      value: 'ocean',
      icon: Sun, // Можно добавить кастомную иконку позже
    },
    {
      name: 'Sunset',
      value: 'sunset',
      icon: Moon, // Можно добавить кастомную иконку позже
    },
    {
      name: 'Forest',
      value: 'forest',
      icon: Sun, // Можно добавить кастомную иконку позже
    },
    {
      name: 'Midnight',
      value: 'midnight',
      icon: Moon, // Можно добавить кастомную иконку позже
    },
    {
      name: 'Lavender',
      value: 'lavender',
      icon: Sun, // Можно добавить кастомную иконку позже
    },
    {
      name: 'Amber',
      value: 'amber',
      icon: Moon, // Можно добавить кастомную иконку позже
    },
    {
      name: 'Simple Hue',
      value: 'simple-hue',
      icon: Palette, // Design tokens theme
    },
  ], []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map(({ name, value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="flex items-center gap-2"
          >
            <Icon className="size-4" />
            <span>{name}</span>
            {theme === value && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ThemeToggle = memo(ThemeToggleComponent);
