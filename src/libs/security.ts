/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T00:00:00
 * Last Updated: 2025-12-23T22:28:36
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Env } from './Env';

// Initialize Redis for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
});

// Rate limiter instance
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '15 m'), // 100 requests per 15 minutes
  analytics: true,
});

// JWT Configuration
export type JWTPayload = {
  userId: string;
  sessionId: string;
  roles?: string[];
  permissions?: string[];
  tenantId?: string;
  iat?: number;
  exp?: number;
};

export type JWTConfig = {
  secret: string;
  expiresIn: string | number;
  algorithm?: jwt.Algorithm;
};

// Password Security
export type PasswordConfig = {
  type?: argon2.Options['type'];
  memoryCost?: number;
  timeCost?: number;
  parallelism?: number;
};

// CSRF Protection
export type CSRFConfig = {
  secret: string;
  expiresIn?: number; // in seconds
};

// Rate Limiting
export type RateLimitConfig = {
  windowMs: number; // window size in milliseconds
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
};

// OAuth Configuration
export type OAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type OAuthTokens = {
  access_token: string;
  refresh_token?: string | null;
  expires_in: number;
  token_type?: string;
};

export type OAuthProfile = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  avatar_url?: string;
};

// Cookie Configuration
export type CookieConfig = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
  domain?: string;
};

/**
 * JWT Management Utilities
 */
export class JWTManager {
  private readonly config: JWTConfig;

  constructor(config: JWTConfig) {
    this.config = {
      algorithm: 'HS256',
      ...config,
    };
  }

  /**
   * Sign a JWT token
   */
  sign(payload: JWTPayload): string {
    return jwt.sign(payload, this.config.secret, {
      algorithm: this.config.algorithm ?? 'HS256',
      expiresIn: this.config.expiresIn,
    } as any);
  }

  /**
   * Verify a JWT token
   */
  verify(token: string): JWTPayload {
    const { secret } = this.config;

    return jwt.verify(token, secret) as JWTPayload;
  }

  /**
   * Decode a JWT token without verification
   */
  decode(token: string): JWTPayload | null {
    return jwt.decode(token) as JWTPayload | null;
  }

  /**
   * Refresh a JWT token
   */
  refresh(token: string): string {
    const payload = this.verify(token);

    // Remove old timestamps
    const { iat, exp, ...refreshPayload } = payload;

    return this.sign(refreshPayload);
  }
}

/**
 * Password Security Utilities
 */
export class PasswordManager {
  private readonly config: PasswordConfig;

  constructor(config: PasswordConfig = {}) {
    this.config = {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
      ...config,
    };
  }

  /**
   * Hash a password using Argon2
   */
  async hash(password: string): Promise<string> {
    return argon2.hash(password, this.config);
  }

  /**
   * Verify a password against its hash using timing-safe comparison
   */
  async verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  /**
   * Validate password strength
   */
  validateStrength(password: string): boolean {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }
}

/**
 * CSRF Protection Utilities
 */
export class CSRFManager {
  private readonly config: CSRFConfig;

  constructor(config: CSRFConfig) {
    this.config = {
      expiresIn: 3600, // 1 hour
      ...config,
    };
  }

  /**
   * Generate a CSRF token
   */
  generate(): { token: string; expiresAt: Date } {
    const tokenBytes = crypto.randomBytes(32);
    const token = tokenBytes.toString('hex');

    const expiresAt = new Date(Date.now() + ((this.config.expiresIn ?? 3600) * 1000));

    return { token, expiresAt };
  }

  /**
   * Validate a CSRF token
   */
  validate(token: string, sessionToken: string): boolean {
    if (!token || !sessionToken) {
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(sessionToken, 'hex'),
    );
  }

  /**
   * Check if a CSRF token is expired
   */
  isExpired(expiresAt: Date): boolean {
    return expiresAt < new Date();
  }
}

/**
 * Rate Limiting Utilities
 */
export class RateLimitManager {
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if a request should be rate limited
   */
  async check(identifier: string): Promise<{ allowed: boolean; reset: Date }> {
    const result = await ratelimit.limit(identifier);
    return {
      allowed: result.success,
      reset: new Date(Date.now() + result.reset),
    };
  }

  /**
   * Get remaining requests for an identifier
   */
  async remaining(identifier: string): Promise<number> {
    const result = await ratelimit.limit(identifier);
    return Math.max(0, this.config.maxRequests - result.remaining);
  }
}

/**
 * Cookie Security Utilities
 */
export class CookieManager {
  /**
   * Get secure cookie options based on environment
   */
  getSecureOptions(environment: string = 'development'): CookieConfig {
    const baseOptions: Omit<CookieConfig, 'secure'> = {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    };

    if (environment === 'production') {
      return {
        ...baseOptions,
        secure: true,
        domain: process.env.COOKIE_DOMAIN,
      };
    } else {
      return {
        ...baseOptions,
        secure: false,
        domain: 'localhost',
      };
    }
  }

  /**
   * Validate cookie value
   */
  validateValue(value: string): boolean {
    // Check for invalid characters and length
    const invalidChars = /[<>'"&]/;
    const hasInvalidChars = invalidChars.test(value);
    const isValidLength = value.length > 0 && value.length < 4096;

    return !hasInvalidChars && isValidLength;
  }

  /**
   * Sign a cookie value
   */
  sign(value: string, secret: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(value + secret);
    const signature = hash.digest('hex');
    return `${value}.${signature}`;
  }

  /**
   * Verify a signed cookie value
   */
  verify(signedValue: string, secret: string): string | null {
    const [value, signature] = signedValue.split('.');
    if (!value || !signature) {
      return null;
    }

    const hash = crypto.createHash('sha256');
    hash.update(value + secret);
    const expectedSignature = hash.digest('hex');

    if (signature === expectedSignature) {
      return value;
    }

    return null;
  }
}

/**
 * OAuth Provider Integration
 */
export class OAuthManager {
  private readonly config: Record<string, OAuthConfig>;

  constructor(config: Record<string, OAuthConfig>) {
    this.config = config;
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(provider: string, state: string): string {
    const providerConfig = this.config[provider];
    if (!providerConfig) {
      throw new Error(`OAuth provider '${provider}' not configured`);
    }

    const baseUrls: Record<string, string> = {
      google: 'https://accounts.google.com/oauth/authorize',
      github: 'https://github.com/login/oauth/authorize',
    };

    const scopes: Record<string, string> = {
      google: 'openid email profile',
      github: 'user:email',
    };

    const params = new URLSearchParams({
      client_id: providerConfig.clientId,
      redirect_uri: providerConfig.redirectUri,
      scope: scopes[provider] ?? 'openid email',
      state,
      response_type: 'code',
    });

    return `${baseUrls[provider]}?${params.toString()}`;
  }

  /**
   * Validate OAuth state parameter
   */
  validateState(receivedState: string, expectedState: string): boolean {
    return receivedState === expectedState;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCode(provider: string, code: string): Promise<OAuthTokens> {
    const providerConfig = this.config[provider];
    if (!providerConfig) {
      throw new Error(`OAuth provider '${provider}' not configured`);
    }

    const tokenUrls: Record<string, string> = {
      google: 'https://oauth2.googleapis.com/token',
      github: 'https://github.com/login/oauth/access_token',
    };

    const params = new URLSearchParams({
      client_id: providerConfig.clientId,
      client_secret: providerConfig.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: providerConfig.redirectUri,
    });

    const tokenUrl = tokenUrls[provider];
    if (!tokenUrl) {
      throw new Error(`OAuth provider '${provider}' not supported for token exchange`);
    }

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`OAuth token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch user profile from OAuth provider
   */
  async fetchProfile(provider: string, accessToken: string): Promise<OAuthProfile> {
    const profileUrls: Record<string, string> = {
      google: 'https://www.googleapis.com/oauth2/v2/userinfo',
      github: 'https://api.github.com/user',
    };

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    };

    // For GitHub, add additional header for email
    if (provider === 'github') {
      headers['User-Agent'] = 'SaaS-Boilerplate';
    }

    const profileUrl = profileUrls[provider];
    if (!profileUrl) {
      throw new Error(`OAuth provider '${provider}' not supported for profile fetch`);
    }

    const response = await fetch(profileUrl, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${provider} profile: ${response.statusText}`);
    }

    const profile = await response.json();

    // Normalize profile data
    if (provider === 'google') {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      };
    } else if (provider === 'github') {
      return {
        id: profile.id.toString(),
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
      };
    }

    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  /**
   * Handle OAuth errors
   */
  handleError(error: string): string {
    const errorMappings: Record<string, string> = {
      access_denied: 'User denied access to their account',
      invalid_request: 'Invalid OAuth request',
      unauthorized_client: 'Unauthorized OAuth client',
      unsupported_response_type: 'Unsupported response type',
      invalid_scope: 'Invalid OAuth scope requested',
      server_error: 'OAuth server error',
      temporarily_unavailable: 'OAuth service temporarily unavailable',
    };

    return errorMappings[error] ?? 'Unknown OAuth error occurred';
  }
}

// Default instances with environment configuration
// Handle cases where environment variables might not be available (e.g., tests)
const getEnvVar = (key: string, defaultValue?: string) => {
  try {
    return (Env as Record<string, string | undefined>)[key] ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

const secret = getEnvVar('BETTER_AUTH_SECRET') ?? 'test-secret-key';
const baseUrl = getEnvVar('BETTER_AUTH_URL') ?? 'http://localhost:3000';
const googleClientId = getEnvVar('GOOGLE_CLIENT_ID') ?? 'test-google-client-id';
const googleClientSecret = getEnvVar('GOOGLE_CLIENT_SECRET') ?? 'test-google-secret';
const githubClientId = getEnvVar('GITHUB_CLIENT_ID') ?? 'test-github-client-id';
const githubClientSecret = getEnvVar('GITHUB_CLIENT_SECRET') ?? 'test-github-secret';

export const jwtManager = new JWTManager({
  secret,
  expiresIn: '1h',
});

export const passwordManager = new PasswordManager();

export const csrfManager = new CSRFManager({
  secret,
});

export const rateLimitManager = new RateLimitManager({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

export const cookieManager = new CookieManager();

export const oauthManager = new OAuthManager({
  google: {
    clientId: googleClientId || 'test-google-client-id',
    clientSecret: googleClientSecret || 'test-google-secret',
    redirectUri: `${baseUrl}/api/auth/google/callback`,
  },
  github: {
    clientId: githubClientId || 'test-github-client-id',
    clientSecret: githubClientSecret || 'test-github-secret',
    redirectUri: `${baseUrl}/api/auth/github/callback`,
  },
});
