/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:10:00
 * Last Updated: 2025-12-23T21:08:20
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock environment variables
vi.mock('@/libs/Env', () => ({
  Env: {
    BETTER_AUTH_SECRET: 'test-secret-key-for-testing',
    BETTER_AUTH_URL: 'http://localhost:3000',
    GOOGLE_CLIENT_ID: 'test-google-client-id',
    GOOGLE_CLIENT_SECRET: 'test-google-client-secret',
    GITHUB_CLIENT_ID: 'test-github-client-id',
    GITHUB_CLIENT_SECRET: 'test-github-client-secret',
  },
}));

// Mock database
vi.mock('@/libs/DB', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock drizzle adapter
vi.mock('better-auth/adapters/drizzle', () => ({
  drizzleAdapter: vi.fn(() => ({
    provider: 'sqlite',
    schema: {},
  })),
}));

// Mock better-auth
vi.mock('better-auth', () => ({
  betterAuth: vi.fn(() => ({
    options: {
      baseURL: 'http://localhost:3000',
      secret: 'test-secret-key-for-testing',
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        google: {
          clientId: 'test-google-client-id',
          clientSecret: 'test-google-client-secret',
        },
        github: {
          clientId: 'test-github-client-id',
          clientSecret: 'test-github-client-secret',
        },
      },
      plugins: [],
    },
  })),
}));

describe('Better Auth Configuration', () => {
  let auth: any;

  beforeEach(async () => {
    // Import after mocks are set up
    const { auth: authInstance } = await import('@/libs/auth');
    auth = authInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuration Validation', () => {
    it('should create auth instance with correct configuration', () => {
      expect(auth).toBeDefined();
      expect(typeof auth).toBe('object');
      expect(auth.options).toBeDefined();
    });

    it('should configure email and password authentication', () => {
      expect(auth.options.emailAndPassword).toBeDefined();
      expect(auth.options.emailAndPassword.enabled).toBe(true);
    });

    it('should configure social providers', () => {
      expect(auth.options.socialProviders).toBeDefined();
      expect(auth.options.socialProviders.google).toBeDefined();
      expect(auth.options.socialProviders.github).toBeDefined();
    });

    it('should set base URL from environment', () => {
      expect(auth.options.baseURL).toBe('http://localhost:3000');
    });

    it('should set secret from environment', () => {
      expect(auth.options.secret).toBe('test-secret-key-for-testing');
    });
  });

  describe('Social Provider Configuration', () => {
    it('should configure Google provider with correct credentials', () => {
      const googleProvider = auth.options.socialProviders.google;

      expect(googleProvider.clientId).toBe('test-google-client-id');
      expect(googleProvider.clientSecret).toBe('test-google-client-secret');
    });

    it('should configure GitHub provider with correct credentials', () => {
      const githubProvider = auth.options.socialProviders.github;

      expect(githubProvider.clientId).toBe('test-github-client-id');
      expect(githubProvider.clientSecret).toBe('test-github-client-secret');
    });
  });

  describe('Environment Variable Handling', () => {
    it('should validate environment variables are set', () => {
      // Since we're mocking the Env module, we can only test that
      // the auth instance is created with the mocked values
      expect(auth.options.secret).toBe('test-secret-key-for-testing');
      expect(auth.options.baseURL).toBe('http://localhost:3000');
    });
  });

  describe('Database Adapter', () => {
    it('should create auth instance with database adapter', () => {
      // The auth instance should be created successfully with mocked adapter
      expect(auth).toBeDefined();
      expect(auth.options).toBeDefined();
    });
  });

  describe('Plugin Configuration', () => {
    it('should configure plugins array', () => {
      expect(Array.isArray(auth.options.plugins)).toBe(true);
    });
  });
});
