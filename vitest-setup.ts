/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T20:45:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';

// Set up environment variables for testing
process.env.BILLING_PLAN_ENV = 'test';
process.env.NODE_ENV = 'test';

// Make vi globally available
(global as any).vi = vi;

// Set up TextEncoder/TextDecoder for tests
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Ensure jsdom globals are available
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
