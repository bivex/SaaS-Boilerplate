/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:40:00
 * Last Updated: 2025-12-23T23:40:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock environment variables before importing auth
vi.mock('./Env', () => ({
  Env: {
    BETTER_AUTH_URL: 'http://localhost:3000',
    BETTER_AUTH_SECRET: 'test-secret',
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    GITHUB_CLIENT_ID: '',
    GITHUB_CLIENT_SECRET: '',
  },
}));

describe('auth configuration', () => {
  let auth: any;

  beforeAll(async () => {
    // Import after mocking
    const authModule = await import('./auth');
    auth = authModule.auth;
  });

  it('should export auth instance', () => {
    expect(auth).toBeDefined();
    expect(typeof auth).toBe('object');
  });

  it('should have api methods', () => {
    expect(auth).toHaveProperty('api');
    expect(typeof auth.api.getSession).toBe('function');
  });

  it('should have handler method', () => {
    expect(auth).toHaveProperty('handler');
    expect(typeof auth.handler).toBe('function');
  });
});
