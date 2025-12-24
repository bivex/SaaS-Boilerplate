/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T22:20:00
 * Last Updated: 2025-12-24T00:08:45
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { google } from 'better-auth/social-providers';
import { eq } from 'drizzle-orm';
import { user } from '@/models/Schema';
import { db } from './DB';
import { Env } from './Env';

// Environment validation and configuration
function validateEnvironment(): void {
  // Skip validation in test environment
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const requiredVars = [
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'DATABASE_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n`
      + 'Please set these variables in your .env file or environment.',
    );
  }

  // Validate secret length
  if ((Env.BETTER_AUTH_SECRET || '').length < 32) {
    console.warn('⚠️  BETTER_AUTH_SECRET should be at least 32 characters long for security');
  }

  console.warn('🔧 Better Auth Environment Check:');
  console.warn('✅ BETTER_AUTH_SECRET:', Env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET');
  console.warn('✅ BETTER_AUTH_URL:', Env.BETTER_AUTH_URL);
  console.warn('✅ DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
}

// Social provider configuration with validation
function configureSocialProviders() {
  const providers: any = {};

  // Google OAuth
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    providers.google = google({
      clientId,
      clientSecret,
    });
  }

  return providers;
}

// Plugin configuration
function configurePlugins() {
  const plugins = [];

  // Organization plugin
  plugins.push(
    organization({
      allowUserToCreateOrganization: true,
      // Additional organization options
      organizationLimit: 10, // Max organizations per user
      memberLimit: 100, // Max members per organization
    }),
  );

  console.warn('✅ Plugins configured:', plugins.length);

  return plugins;
}

// Validate environment before creating auth instance
validateEnvironment();

console.warn('🔧 Creating Better Auth instance...');

// Create social providers configuration with email conflict checking
const socialProvidersConfig: any = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProvidersConfig.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectURI: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`,
  };
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),

  // Security check: prevent account creation if email already exists
  // This prevents automatic account linking without user consent
  onBeforeCreateAccount: async ({ user: newUser}: { user: { email: string } }) => {
    // Check if user with this email already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, newUser.email))
      .limit(1);

    if (existingUser.length > 0) {
      // Email already exists - block automatic account creation
      throw new Error(
        `An account with email ${newUser.email} already exists. `
        + `To link your Google account, please sign in to your existing account and configure the integration in settings.`,
      );
    }

    return true; // Allow account creation if email is unique
  },

  // Enhanced email and password configuration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Email verification disabled
    sendResetPassword: async ({ user, url }) => {
      // Custom password reset email sending logic
      // In production, integrate with your email service (Resend, SendGrid, etc.)
      console.warn(`📧 Password reset email would be sent to ${user.email}: ${url}`);

      // For now, just log the reset URL
      // You can integrate with your email service here
    },
  },

  // Enhanced social providers - conditionally configured based on environment variables
  socialProviders: socialProvidersConfig,

  // Custom social provider sign-in logic
  onBeforeSignIn: async ({ user: signInUser, account}: { user: any; account: any }) => {
    if (account?.providerId === 'google') {
      // Check if user exists and has Google linked
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, signInUser.email))
        .limit(1);

      if (existingUser.length > 0) {
        // User exists - check if Google is linked
        const userData = existingUser[0];
        if (userData && !userData.googleLinked) {
          throw new Error(
            'Google authentication is not enabled for this account. '
            + 'Please sign in with your email and password first, then link your Google account in settings.',
          );
        }
      }
    }

    return true;
  },

  // Handle post-account creation for social providers
  onAfterCreateAccount: async ({ user: newUser, account}: { user: any; account: any }) => {
    if (account?.providerId === 'google') {
      // Link Google account for new users
      await db
        .update(user)
        .set({ googleLinked: true })
        .where(eq(user.id, newUser.id));
    }
  },

  // Redirect configuration for auth flows
  redirectTo: {
    signIn: '/dashboard',
    signUp: '/dashboard',
    callback: '/dashboard',
  },

  // Plugins
  plugins: configurePlugins(),

  // Base configuration
  baseURL: Env.BETTER_AUTH_URL,
  secret: Env.BETTER_AUTH_SECRET,

  // Additional security options
  trustedOrigins: [
    Env.BETTER_AUTH_URL,
    // Add other trusted origins as needed
  ],

  // Session configuration
  session: {
    // Session expires in 7 days
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  // Rate limiting (basic protection against brute force)
  rateLimit: {
    window: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },

  // Advanced options
  advanced: {
    // Cross-Site Request Forgery protection
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
    },

    // Cookie settings
    cookies: {
      session: {
        name: 'better-auth.session',
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
  },
});

console.warn('✅ Better Auth instance created successfully');

// Export configuration for testing and debugging
export const authConfig = {
  baseURL: Env.BETTER_AUTH_URL,
  secret: Env.BETTER_AUTH_SECRET,
  emailVerificationEnabled: false,
  socialProvidersConfigured: Object.keys(configureSocialProviders()).length,
  pluginsConfigured: configurePlugins().length,
};
