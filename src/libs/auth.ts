/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T22:20:00
 * Last Updated: 2025-12-23T23:34:47
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { google } from 'better-auth/social-providers';
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
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please set these variables in your .env file or environment.'
    );
  }

  // Validate secret length
  if ((Env.BETTER_AUTH_SECRET || '').length < 32) {
    console.warn('⚠️  BETTER_AUTH_SECRET should be at least 32 characters long for security');
  }

  // Validate URL format
  try {
    new URL(Env.BETTER_AUTH_URL || '');
  } catch {
    throw new Error('BETTER_AUTH_URL must be a valid URL');
  }

  console.log('🔧 Better Auth Environment Check:');
  console.log('✅ BETTER_AUTH_SECRET:', Env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET');
  console.log('✅ BETTER_AUTH_URL:', Env.BETTER_AUTH_URL);
  console.log('✅ DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
}

// Email templates for better-auth
const emailTemplates = {
  emailVerification: {
    subject: 'Verify your email address',
    text: ({ url }: { url: string }) => `Click the link to verify your email: ${url}`,
    html: ({ url }: { url: string }) => `
      <div>
        <h1>Welcome!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${url}">Verify Email</a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  },
  passwordReset: {
    subject: 'Reset your password',
    text: ({ url }: { url: string }) => `Click the link to reset your password: ${url}`,
    html: ({ url }: { url: string }) => `
      <div>
        <h1>Password Reset</h1>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${url}">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  },
};

// Social provider configuration with validation
function configureSocialProviders() {
  const providers: any = {};

  // Google OAuth
  console.log('🔍 DEBUG - GOOGLE_CLIENT_ID:', Env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
  console.log('🔍 DEBUG - GOOGLE_CLIENT_ID length:', Env.GOOGLE_CLIENT_ID?.length || 0);
  console.log('🔍 DEBUG - GOOGLE_CLIENT_ID value:', Env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...');
  console.log('🔍 DEBUG - GOOGLE_CLIENT_SECRET:', Env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
  console.log('🔍 DEBUG - GOOGLE_CLIENT_SECRET length:', Env.GOOGLE_CLIENT_SECRET?.length || 0);
  console.log('🔍 DEBUG - GOOGLE_CLIENT_SECRET value:', Env.GOOGLE_CLIENT_SECRET?.substring(0, 10) + '...');

  // Try using process.env directly instead of Env object
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    const googleConfig = {
      clientId,
      clientSecret,
      redirectURI: `${Env.BETTER_AUTH_URL}/api/auth/callback/google`,
    };
    console.log('🔍 DEBUG - Passing to google():', JSON.stringify(googleConfig, null, 2));
    providers.google = google(googleConfig);
    console.log('✅ Google OAuth: CONFIGURED with redirectURI:', googleConfig.redirectURI);
  } else {
    console.log('⚠️  Google OAuth: NOT CONFIGURED (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
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
    })
  );

  console.log('✅ Plugins configured:', plugins.length);

  return plugins;
}

// Validate environment before creating auth instance
validateEnvironment();

console.log('🔧 Creating Better Auth instance...');

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),

  // Enhanced email and password configuration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Email verification disabled
    sendResetPassword: async ({ user, url }) => {
      // Custom password reset email sending logic
      // In production, integrate with your email service (Resend, SendGrid, etc.)
      console.log(`📧 Password reset email would be sent to ${user.email}: ${url}`);

      // For now, just log the reset URL
      // You can integrate with your email service here
    },
    // Custom email verification
    sendEmailVerification: async ({ user, url }: { user: any; url: string }) => {
      console.log(`📧 Email verification would be sent to ${user.email}: ${url}`);

      // Integrate with your email service
    },
  },

  // Enhanced social providers - conditionally configured based on environment variables
  socialProviders: configureSocialProviders(),

  // Email templates
  emailTemplates,

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
      enabled: true,
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
    },

    // Cookie settings
    cookies: {
      session: {
        name: 'better-auth.session',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    },
  },
});

console.log('✅ Better Auth instance created successfully');

// Export configuration for testing and debugging
export const authConfig = {
  baseURL: Env.BETTER_AUTH_URL,
  secret: Env.BETTER_AUTH_SECRET,
  emailVerificationEnabled: false,
  socialProvidersConfigured: Object.keys(configureSocialProviders()).length,
  pluginsConfigured: configurePlugins().length,
};
