/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T22:20:00
 * Last Updated: 2025-12-23T21:00:04
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './DB';
import { Env } from './Env';

console.log('🔧 Better Auth Environment Check:');
console.log('BETTER_AUTH_SECRET:', Env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET');
console.log('BETTER_AUTH_URL:', Env.BETTER_AUTH_URL);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: Env.GOOGLE_CLIENT_ID || '',
      clientSecret: Env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
      clientId: Env.GITHUB_CLIENT_ID || '',
      clientSecret: Env.GITHUB_CLIENT_SECRET || '',
    },
  },
  // plugins: [
  //   organization({
  //     allowUserToCreateOrganization: true,
  //   }),
  // ],
  baseURL: Env.BETTER_AUTH_URL,
  secret: Env.BETTER_AUTH_SECRET,
});
