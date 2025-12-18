/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-18T21:10:34
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import '@testing-library/jest-dom/vitest';

import failOnConsole from 'vitest-fail-on-console';

failOnConsole({
  shouldFailOnDebug: true,
  shouldFailOnError: true,
  shouldFailOnInfo: true,
  shouldFailOnLog: true,
  shouldFailOnWarn: true,
});

// Set up environment variables for testing
process.env.BILLING_PLAN_ENV = 'test';
