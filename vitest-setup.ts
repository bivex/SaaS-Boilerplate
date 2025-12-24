/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-24T02:54:52
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { TextDecoder, TextEncoder } from 'node:util';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import 'vitest-mock-extended';

// Set up environment variables for testing
process.env.BILLING_PLAN_ENV = 'test';
if (process.env.NODE_ENV !== 'test') {
  try {
    (process.env as any).NODE_ENV = 'test';
  } catch {
    // NODE_ENV might be read-only in some environments
  }
}
process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing';
process.env.BETTER_AUTH_URL = 'http://localhost:3000';
process.env.DATABASE_URL = './sqlite.db';

// Make vi globally available
(globalThis as any).vi = vi;

// Set up TextEncoder/TextDecoder for tests
globalThis.TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

// Ensure jsdom globals are available
if (typeof window !== 'undefined') {
  // Mock matchMedia
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

  // Mock location
  delete (window as any).location;
  (window as any).location = {
    href: 'http://localhost:3000/',
    pathname: '/',
    search: '',
    hash: '',
  };

  // Make href writable
  Object.defineProperty((window as any).location, 'href', {
    writable: true,
    value: 'http://localhost:3000/',
  });
}
