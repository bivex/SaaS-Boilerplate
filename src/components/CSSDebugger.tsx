/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T17:40:00
 * Last Updated: 2025-12-24T01:03:42
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import { useEffect, useState } from 'react';

type CSSDebuggerProps = {
  showGrid?: boolean;
  showOutlines?: boolean;
  showBreakpoints?: boolean;
};

export function CSSDebugger({ showGrid = false, showOutlines = false, showBreakpoints = false }: CSSDebuggerProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('');

  useEffect(() => {
    // Update breakpoint indicator
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      let breakpoint = 'xs';
      if (width >= 1280) {
        breakpoint = 'xl';
      } else if (width >= 1024) {
        breakpoint = 'lg';
      } else if (width >= 768) {
        breakpoint = 'md';
      } else if (width >= 640) {
        breakpoint = 'sm';
      }
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setCurrentBreakpoint(breakpoint);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  useEffect(() => {
    // Apply debug styles
    const styleId = 'css-debug-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    let css = '';

    // Grid overlay
    if (showGrid) {
      css += `
        .debug-grid::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          z-index: 9999;
        }
      `;
    }

    // Element outlines
    if (showOutlines) {
      css += `
        .debug-outlines * {
          outline: 1px solid rgba(255, 0, 0, 0.3) !important;
        }
        .debug-outlines *:hover {
          outline: 2px solid rgba(255, 0, 0, 0.8) !important;
          outline-offset: -1px !important;
        }
      `;
    }

    styleElement.textContent = css;

    // Apply debug classes to body
    if (showGrid) {
      document.body.classList.add('debug-grid');
    } else {
      document.body.classList.remove('debug-grid');
    }

    if (showOutlines) {
      document.body.classList.add('debug-outlines');
    } else {
      document.body.classList.remove('debug-outlines');
    }

    return () => {
      // Cleanup on unmount
      document.body.classList.remove('debug-grid', 'debug-outlines');
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [showGrid, showOutlines]);

  if (!showBreakpoints && !showGrid && !showOutlines) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg font-mono text-sm space-y-2">
      {showBreakpoints && (
        <div className="flex items-center gap-2">
          <span className="text-blue-400">Breakpoint:</span>
          <span className="bg-blue-600 px-2 py-1 rounded uppercase font-bold">
            {currentBreakpoint}
          </span>
        </div>
      )}

      {showGrid && (
        <div className="flex items-center gap-2">
          <span className="text-green-400">Grid:</span>
          <span className="bg-green-600 px-2 py-1 rounded">ON</span>
        </div>
      )}

      {showOutlines && (
        <div className="flex items-center gap-2">
          <span className="text-red-400">Outlines:</span>
          <span className="bg-red-600 px-2 py-1 rounded">ON</span>
        </div>
      )}
    </div>
  );
}

// Quick debug utilities
const DebugUtils = {
  // Add to any element for debugging
  debugElement: (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      (element as HTMLElement).style.outline = '2px solid red';
    }
  },

  // Log current theme variables
  logThemeVars: () => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const vars = Array.from(styles).filter(prop => prop.startsWith('--color'));
    return vars.map(prop => `${prop}: ${styles.getPropertyValue(prop)}`);
  },

  // Toggle debug grid
  toggleGrid: () => {
    document.body.classList.toggle('debug-grid');
  },

  // Toggle element outlines
  toggleOutlines: () => {
    document.body.classList.toggle('debug-outlines');
  },

  // Show current breakpoint
  showBreakpoint: () => {
    const width = window.innerWidth;
    let breakpoint = 'xs';
    if (width >= 1280) {
      breakpoint = 'xl';
    } else if (width >= 1024) {
      breakpoint = 'lg';
    } else if (width >= 768) {
      breakpoint = 'md';
    } else if (width >= 640) {
      breakpoint = 'sm';
    }
    return breakpoint;
  },

  // List all Tailwind classes on an element
  inspectClasses: (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      const classes = Array.from(element.classList);
      return classes;
    }
    return [];
  },
};

// Make DebugUtils available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).DebugUtils = DebugUtils;
}

// Export DebugUtils for external use (non-component export)
export { DebugUtils };
