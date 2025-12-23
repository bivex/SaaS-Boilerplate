/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:45:00
 * Last Updated: 2025-12-23T23:45:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { execSync } from 'node:child_process';
import { test as setup } from '@playwright/test';

setup('setup database for e2e tests', async () => {
  // Ensure database is migrated and ready
  try {
    console.log('Setting up database for e2e tests...');

    // Run database migration
    execSync('npm run db:migrate', { stdio: 'inherit' });

    console.log('Database setup complete');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
});
