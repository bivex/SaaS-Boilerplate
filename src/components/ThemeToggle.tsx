/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T09:45:12
 * Last Updated: 2025-12-23T09:50:18
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { Monitor, Moon, Palette, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getInitialColorTheme = () => {
  const element = document.documentElement;
  if (element.classList.contains('blue')) {
    return 'blue';
  } else if (element.classList.contains('green')) {
    return 'green';
  } else if (element.classList.contains('purple')) {
    return 'purple';
  } else {
    return 'light';
  }
};

const colorThemes = [
  {
    name: 'Default',
    value: 'light',
    description: 'Default theme',
  },
  {
    name: 'Blue',
    value: 'blue',
    description: 'Blue theme',
  },
  {
    name: 'Green',
    value: 'green',
    description: 'Green theme',
  },
  {
    name: 'Purple',
    value: 'purple',
    description: 'Purple theme',
  },
];

const modeThemes = [
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
];

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [currentColorTheme, setCurrentColorTheme] = useState(() => getInitialColorTheme());

  const setColorTheme = (colorTheme: string) => {
    // Update state immediately for UI feedback
    setCurrentColorTheme(colorTheme);

    // Remove any existing color theme classes
    document.documentElement.classList.remove('blue', 'green', 'purple');

    // Add the new color theme if it's not default
    if (colorTheme !== 'light') {
      document.documentElement.classList.add(colorTheme);
    }

    // Update the theme for light/dark mode
    setTheme(colorTheme === 'light' ? 'light' : theme === 'dark' ? 'dark' : 'system');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="size-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        {colorThemes.map(({ name, value, description }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setColorTheme(value)}
            className="flex items-center gap-2"
          >
            <span>{name}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
            {currentColorTheme === value && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        {modeThemes.map(({ name, value, icon: Icon }) => (
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
