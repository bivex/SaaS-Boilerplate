/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T17:30:00
 * Last Updated: 2025-12-24T01:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeDemo() {
  const { theme, setTheme } = useTheme();
  const [hue, setHue] = useState(222);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setMounted(true);
  }, []);

  // Custom theme definitions
  const themes = useMemo(() => ({
    light: {
      'background': '0 0% 100%',
      'foreground': '222.2 84% 4.9%',
      'primary': '222.2 47.4% 11.2%',
      'primary-foreground': '210 40% 98%',
      'secondary': '210 40% 96.1%',
      'secondary-foreground': '222.2 47.4% 11.2%',
      'muted': '210 40% 96.1%',
      'muted-foreground': '215.4 16.3% 30%',
      'accent': '210 40% 96.1%',
      'accent-foreground': '222.2 47.4% 11.2%',
      'card': '0 0% 100%',
      'card-foreground': '222.2 84% 4.9%',
      'popover': '0 0% 100%',
      'popover-foreground': '222.2 84% 4.9%',
      'border': '214.3 31.8% 91.4%',
      'input': '214.3 31.8% 91.4%',
      'ring': '222.2 84% 4.9%',
      'destructive': '0 84.2% 60.2%',
      'destructive-foreground': '210 40% 98%',
    },
    dark: {
      'background': '222.2 84% 4.9%',
      'foreground': '210 40% 98%',
      'primary': '210 40% 98%',
      'primary-foreground': '222.2 47.4% 11.2%',
      'secondary': '217.2 32.6% 17.5%',
      'secondary-foreground': '210 40% 98%',
      'muted': '217.2 32.6% 17.5%',
      'muted-foreground': '215 20.2% 70%',
      'accent': '217.2 32.6% 17.5%',
      'accent-foreground': '210 40% 98%',
      'card': '222.2 84% 4.9%',
      'card-foreground': '210 40% 98%',
      'popover': '222.2 84% 4.9%',
      'popover-foreground': '210 40% 98%',
      'border': '217.2 32.6% 17.5%',
      'input': '217.2 32.6% 17.5%',
      'ring': '212.7 26.8% 83.9%',
      'destructive': '0 62.8% 30.6%',
      'destructive-foreground': '210 40% 98%',
    },
    ocean: {
      'background': '200 100% 95%',
      'foreground': '200 100% 10%',
      'primary': '200 100% 40%',
      'primary-foreground': '200 100% 95%',
      'secondary': '200 50% 85%',
      'secondary-foreground': '200 100% 20%',
      'muted': '200 40% 90%',
      'muted-foreground': '200 20% 35%',
      'accent': '180 100% 35%',
      'accent-foreground': '180 100% 95%',
      'card': '200 100% 98%',
      'card-foreground': '200 100% 10%',
      'popover': '200 100% 98%',
      'popover-foreground': '200 100% 10%',
      'border': '200 30% 80%',
      'input': '200 30% 80%',
      'ring': '200 100% 40%',
      'destructive': '0 84.2% 60.2%',
      'destructive-foreground': '200 100% 95%',
    },
    sunset: {
      'background': '20 100% 98%',
      'foreground': '20 100% 10%',
      'primary': '20 100% 50%',
      'primary-foreground': '20 100% 95%',
      'secondary': '20 50% 90%',
      'secondary-foreground': '20 100% 20%',
      'muted': '20 40% 95%',
      'muted-foreground': '20 20% 35%',
      'accent': '340 100% 50%',
      'accent-foreground': '340 100% 95%',
      'card': '20 100% 98%',
      'card-foreground': '20 100% 10%',
      'popover': '20 100% 98%',
      'popover-foreground': '20 100% 10%',
      'border': '20 30% 85%',
      'input': '20 30% 85%',
      'ring': '20 100% 50%',
      'destructive': '0 84.2% 60.2%',
      'destructive-foreground': '20 100% 95%',
    },
    forest: {
      'background': '120 40% 98%',
      'foreground': '120 100% 8%',
      'primary': '142 76% 36%',
      'primary-foreground': '120 40% 98%',
      'secondary': '120 30% 88%',
      'secondary-foreground': '120 100% 15%',
      'muted': '120 20% 92%',
      'muted-foreground': '120 10% 30%',
      'accent': '158 64% 52%',
      'accent-foreground': '120 40% 98%',
      'card': '120 40% 98%',
      'card-foreground': '120 100% 8%',
      'popover': '120 40% 98%',
      'popover-foreground': '120 100% 8%',
      'border': '120 20% 82%',
      'input': '120 20% 82%',
      'ring': '142 76% 36%',
      'destructive': '0 84.2% 60.2%',
      'destructive-foreground': '120 40% 98%',
    },
    midnight: {
      'background': '222 84% 4.9%',
      'foreground': '210 40% 98%',
      'primary': '217 91% 60%',
      'primary-foreground': '222 84% 4.9%',
      'secondary': '217 33% 17%',
      'secondary-foreground': '210 40% 98%',
      'muted': '217 19% 12%',
      'muted-foreground': '215 20% 70%',
      'accent': '262 83% 58%',
      'accent-foreground': '210 40% 98%',
      'card': '217 33% 17%',
      'card-foreground': '210 40% 98%',
      'popover': '222 84% 4.9%',
      'popover-foreground': '210 40% 98%',
      'border': '217 19% 12%',
      'input': '217 19% 12%',
      'ring': '217 91% 60%',
      'destructive': '0 63% 31%',
      'destructive-foreground': '210 40% 98%',
    },
    lavender: {
      'background': '270 100% 98%',
      'foreground': '270 100% 8%',
      'primary': '262 83% 58%',
      'primary-foreground': '270 100% 98%',
      'secondary': '270 30% 88%',
      'secondary-foreground': '270 100% 15%',
      'muted': '270 20% 92%',
      'muted-foreground': '270 10% 30%',
      'accent': '291 64% 42%',
      'accent-foreground': '270 100% 98%',
      'card': '270 100% 98%',
      'card-foreground': '270 100% 8%',
      'popover': '270 100% 98%',
      'popover-foreground': '270 100% 8%',
      'border': '270 20% 82%',
      'input': '270 20% 82%',
      'ring': '262 83% 58%',
      'destructive': '0 84.2% 60.2%',
      'destructive-foreground': '270 100% 98%',
    },
    amber: {
      'background': '48 100% 98%',
      'foreground': '48 100% 8%',
      'primary': '45 93% 47%',
      'primary-foreground': '48 100% 98%',
      'secondary': '48 30% 88%',
      'secondary-foreground': '48 100% 15%',
      'muted': '48 20% 92%',
      'muted-foreground': '48 10% 30%',
      'accent': '25 95% 53%',
      'accent-foreground': '48 100% 98%',
      'card': '48 100% 98%',
      'card-foreground': '48 100% 8%',
      'popover': '48 100% 98%',
      'popover-foreground': '48 100% 8%',
      'border': '48 20% 82%',
      'input': '48 20% 82%',
      'ring': '45 93% 47%',
      'destructive': '0 84.2% 60.2%',
      'destructive-foreground': '48 100% 98%',
    },
  }), []);

  // Apply custom theme colors to CSS custom properties and classes
  useEffect(() => {
    if (mounted && theme) {
      const root = document.documentElement;

      // Remove all theme classes first
      root.classList.remove('light', 'dark', 'ocean', 'sunset', 'forest', 'midnight', 'lavender', 'amber');

      // Apply the current theme class
      if (theme !== 'system') {
        root.classList.add(theme);
      }

      // Also apply colors directly to CSS custom properties for custom themes
      if (themes[theme as keyof typeof themes]) {
        const themeColors = themes[theme as keyof typeof themes];
        Object.entries(themeColors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });
      }
    }
  }, [theme, mounted, themes]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-lg border bg-card text-card-foreground">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Tailwind CSS 4 Theme Demo</h2>
            <p className="text-sm text-muted-foreground">
              Демонстрация новых возможностей тем в Tailwind 4
            </p>
          </div>
          {/* Loading state */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Темы:</h3>
            <div className="flex gap-2 flex-wrap">
              {['light', 'dark', 'ocean', 'sunset', 'forest', 'midnight', 'lavender', 'amber'].map(t => (
                <Button
                  key={t}
                  variant="outline"
                  size="sm"
                  disabled
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg border bg-card text-card-foreground">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Tailwind CSS 4 Theme Demo</h2>
          <p className="text-sm text-muted-foreground">
            Демонстрация новых возможностей тем в Tailwind 4
          </p>
        </div>
        {/* Переключение тем */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Темы:</h3>
          <div className="flex gap-2 flex-wrap">
            {['light', 'dark', 'ocean', 'sunset', 'forest', 'midnight', 'lavender', 'amber'].map(t => (
              <Button
                key={t}
                variant={theme === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme(t)}
                className="capitalize"
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Opacity модификаторы */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Opacity модификаторы:</h3>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-primary text-primary-foreground px-3 py-2 rounded text-sm">
              100%
            </div>
            <div className="bg-primary/90 text-primary-foreground px-3 py-2 rounded text-sm">
              90%
            </div>
            <div className="bg-primary/50 text-primary-foreground px-3 py-2 rounded text-sm">
              50%
            </div>
            <div className="bg-primary/25 text-primary-foreground px-3 py-2 rounded text-sm">
              25%
            </div>
          </div>
        </div>

        {/* Динамические цвета */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Динамические цвета:</h3>
          <label htmlFor="hue-slider" className="text-sm text-muted-foreground">
            Hue:
            {' '}
            {hue}
          </label>
          <input
            id="hue-slider"
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={e => setHue(Number(e.target.value))}
            className="w-full"
            aria-label="Hue color slider"
          />
          <div
            style={{
              '--color-dynamic': `${hue} 47.4% 11.2%`,
              '--color-dynamic-foreground': `${hue} 40% 98%`,
            } as React.CSSProperties}
            className="bg-[var(--color-dynamic)] text-[var(--color-dynamic-foreground)] px-3 py-2 rounded text-sm text-center"
          >
            HSL:
            {' '}
            {hue}
            {' '}
            47.4% 11.2%
          </div>
        </div>

        {/* Кастомные переменные */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Кастомные переменные:</h3>
          <div className="bg-brand text-white px-3 py-2 rounded text-sm text-center">
            bg-brand (если определена)
          </div>
        </div>
      </div>
    </div>
  );
}
