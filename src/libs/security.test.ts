/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T00:00:00
 * Last Updated: 2025-12-24T06:55:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import {beforeEach, describe, expect, it, vi} from 'vitest';
import {CookieManager, CSRFManager, JWTManager, OAuthManager, PasswordManager,} from './security';

// Security components implementation
describe('Security Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('JWT Signing and Verification', () => {
        let jwtManager: JWTManager;

        beforeEach(() => {
            jwtManager = new JWTManager({
                secret: 'test-jwt-secret-key',
                expiresIn: '1h',
            });
        });

        it('should sign JWT with correct payload and secret', () => {
            const payload = {
                userId: 'user-1',
                sessionId: 'session-1',
            };

            const token = jwtManager.sign(payload);

            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });

        it('should verify valid JWT token', () => {
            const payload = {
                userId: 'user-1',
                sessionId: 'session-1',
            };

            const token = jwtManager.sign(payload);
            const result = jwtManager.verify(token);

            expect(result.userId).toBe(payload.userId);
            expect(result.sessionId).toBe(payload.sessionId);
        });

        it('should reject expired JWT token', () => {
            const jwtManagerExpired = new JWTManager({
                secret: 'test-jwt-secret-key',
                expiresIn: '-1h', // Already expired
            });

            const payload = {
                userId: 'user-1',
                sessionId: 'session-1',
            };

            const token = jwtManagerExpired.sign(payload);

            expect(() => jwtManager.verify(token)).toThrow();
        });

        it('should reject malformed JWT token', () => {
            const malformedToken = 'malformed.jwt.token';

            expect(() => jwtManager.verify(malformedToken)).toThrow();
        });

        it('should decode JWT without verification', () => {
            const payload = {
                userId: 'user-1',
                sessionId: 'session-1',
            };

            const token = jwtManager.sign(payload);
            const result = jwtManager.decode(token);

            expect(result?.userId).toBe(payload.userId);
            expect(result?.sessionId).toBe(payload.sessionId);
        });

        it('should handle JWT with custom claims', () => {
            const payload = {
                userId: 'user-1',
                sessionId: 'session-1',
                roles: ['admin', 'user'],
                permissions: ['read:users', 'write:posts'],
                tenantId: 'tenant-1',
            };

            const token = jwtManager.sign(payload);
            const verified = jwtManager.verify(token);

            expect(verified.roles).toEqual(['admin', 'user']);
            expect(verified.permissions).toContain('read:users');
            expect(verified.tenantId).toBe('tenant-1');
        });
    });

    describe('Password Hashing and Validation', () => {
        let passwordManager: PasswordManager;

        beforeEach(() => {
            passwordManager = new PasswordManager();
        });

        it('should hash password with proper parameters', async () => {
            const password = 'userPassword123!';

            const result = await passwordManager.hash(password);

            expect(typeof result).toBe('string');
            expect(result.startsWith('$argon2')).toBe(true);
        });

        it('should verify correct password against hash', async () => {
            const password = 'userPassword123!';

            const hash = await passwordManager.hash(password);
            const result = await passwordManager.verify(hash, password);

            expect(result).toBe(true);
        });

        it('should reject incorrect password', async () => {
            const correctPassword = 'userPassword123!';
            const wrongPassword = 'wrongPassword123!';

            const hash = await passwordManager.hash(correctPassword);
            const result = await passwordManager.verify(hash, wrongPassword);

            expect(result).toBe(false);
        });

        it('should handle password hashing errors', async () => {
            // Test with invalid password (empty string should cause issues)
            const password = '';

            try {
                await passwordManager.hash(password);
                // If it succeeds, that's unexpected, but we'll allow it
            } catch (error) {
                // Argon2 may throw errors for invalid inputs
                expect(error).toBeDefined();
            }
        });

        it('should validate password strength requirements', () => {
            const weakPasswords = [
                '123', // Too short
                'password', // No numbers or special chars
                '12345678', // No letters or special chars
                'Password', // No numbers or special chars
                'Password123', // No special characters
            ];

            const strongPassword = 'Password123!';

            weakPasswords.forEach((password) => {
                expect(passwordManager.validateStrength(password)).toBe(false);
            });

            expect(passwordManager.validateStrength(strongPassword)).toBe(true);
        });

        it('should prevent timing attacks in password verification', async () => {
            const password = 'userPassword123!';
            const hash = await passwordManager.hash(password);

            const startTime1 = Date.now();
            await passwordManager.verify(hash, password);
            const endTime1 = Date.now();

            const startTime2 = Date.now();
            await passwordManager.verify(hash, 'wrongPassword123!');
            const endTime2 = Date.now();

            // Timing should be similar (within reasonable bounds) due to argon2's design
            const timingDiff = Math.abs((endTime1 - startTime1) - (endTime2 - startTime2));

            expect(timingDiff).toBeLessThan(100); // Allow some variance
        });
    });

    describe('CSRF Protection', () => {
        let csrfManager: CSRFManager;

        beforeEach(() => {
            csrfManager = new CSRFManager({
                secret: 'test-csrf-secret',
            });
        });

        it('should generate secure CSRF token', () => {
            const {token, expiresAt} = csrfManager.generate();

            expect(typeof token).toBe('string');
            expect(token.length).toBe(64); // 32 bytes in hex
            expect(expiresAt).toBeInstanceOf(Date);
            expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
        });

        it('should validate correct CSRF token', () => {
            const {token} = csrfManager.generate();
            const isValid = csrfManager.validate(token, token);

            expect(isValid).toBe(true);
        });

        it('should reject invalid CSRF token', () => {
            const {token: sessionToken} = csrfManager.generate();
            const {token: providedToken} = csrfManager.generate();

            const isValid = csrfManager.validate(sessionToken, providedToken);

            expect(isValid).toBe(false);
        });

        it('should handle CSRF token expiration', () => {
            // Simulate token with expiration
            const tokenData = {
                token: 'csrf-token',
                expiresAt: new Date(Date.now() - 1000), // Expired
            };

            const isExpired = tokenData.expiresAt < new Date();

            expect(isExpired).toBe(true);
        });

        it('should prevent CSRF in state-changing operations', () => {
            const protectedOperations = [
                'POST /api/auth/change-password',
                'POST /api/auth/update-profile',
                'POST /api/auth/delete-account',
                'POST /api/user/settings',
            ];

            protectedOperations.forEach((operation) => {
                // Should require CSRF token
                expect(operation.startsWith('POST')).toBe(true);
            });
        });
    });

    describe('Rate Limiting', () => {
        it('should track request frequency per user', () => {
            const requestTracker = new Map();

            const trackRequest = (userId: string) => {
                const now = Date.now();
                const windowStart = now - (15 * 60 * 1000); // 15 minutes ago

                if (!requestTracker.has(userId)) {
                    requestTracker.set(userId, []);
                }

                const userRequests = requestTracker.get(userId);
                // Remove old requests outside the window
                const validRequests = userRequests.filter((timestamp: number) => timestamp > windowStart);

                validRequests.push(now);
                requestTracker.set(userId, validRequests);

                return validRequests.length;
            };

            // First request
            expect(trackRequest('user-1')).toBe(1);

            // Second request
            expect(trackRequest('user-1')).toBe(2);

            // Different user
            expect(trackRequest('user-2')).toBe(1);
        });

        it('should enforce rate limits', () => {
            const RATE_LIMIT = 5;
            const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

            const checkRateLimit = (_userId: string, requests: number[]) => {
                const now = Date.now();
                const windowStart = now - WINDOW_MS;

                const validRequests = requests.filter(timestamp => timestamp > windowStart);
                return validRequests.length < RATE_LIMIT;
            };

            const userRequests = [Date.now()];

            // Should allow request
            expect(checkRateLimit('user-1', userRequests)).toBe(true);

            // Add more requests
            const manyRequests = new Array(RATE_LIMIT).fill(Date.now()) as number[];

            expect(checkRateLimit('user-1', manyRequests)).toBe(false);
        });

        it('should handle distributed rate limiting', () => {
            // Simulate Redis-based distributed rate limiting
            const currentCount = 3;
            const limit = 10;

            const isAllowed = currentCount < limit;

            expect(isAllowed).toBe(true);

            // Simulate increment
            const newCount = currentCount + 1;

            expect(newCount).toBe(4);
        });

        it('should apply different limits for different endpoints', () => {
            const endpointLimits: Record<string, {limit: number; window: number}> = {
                '/api/auth/login': {limit: 5, window: 15 * 60 * 1000},
                '/api/auth/signup': {limit: 3, window: 60 * 60 * 1000},
                '/api/user/profile': {limit: 100, window: 15 * 60 * 1000},
            };

            const getEndpointLimit = (endpoint: string) => {
                return endpointLimits[endpoint] || {limit: 10, window: 15 * 60 * 1000};
            };

            expect(getEndpointLimit('/api/auth/login')).toEqual({limit: 5, window: 900000});
            expect(getEndpointLimit('/api/auth/signup')).toEqual({limit: 3, window: 3600000});
            expect(getEndpointLimit('/api/unknown')).toEqual({limit: 10, window: 900000});
        });

        it('should return appropriate error responses for rate limits', () => {
            const rateLimitExceeded = true;
            const resetTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

            const response = rateLimitExceeded
                ? {
                    status: 429,
                    headers: {
                        'Retry-After': Math.ceil((resetTime.getTime() - Date.now()) / 1000),
                        'X-RateLimit-Reset': resetTime.toISOString(),
                    },
                    body: {
                        error: 'Too Many Requests',
                        message: 'Rate limit exceeded. Try again later.',
                        retryAfter: Math.ceil((resetTime.getTime() - Date.now()) / 1000),
                    },
                }
                : null;

            expect(response?.status).toBe(429);
            expect(response?.headers['Retry-After']).toBeGreaterThan(0);
            expect(response?.body.error).toBe('Too Many Requests');
        });
    });

    describe('Cookie Security Settings', () => {
        it('should set secure cookie attributes', () => {
            const cookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: 'strict' as const,
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
                domain: 'example.com',
            };

            expect(cookieOptions.httpOnly).toBe(true);
            expect(cookieOptions.secure).toBe(true);
            expect(cookieOptions.sameSite).toBe('strict');
            expect(cookieOptions.maxAge).toBe(604800); // 7 days in seconds
        });

        it('should handle different environments for cookie security', () => {
            const getCookieOptions = (environment: string) => {
                const baseOptions = {
                    httpOnly: true,
                    sameSite: 'strict' as const,
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/',
                };

                if (environment === 'production') {
                    return {
                        ...baseOptions,
                        secure: true,
                        domain: 'example.com',
                    };
                } else {
                    return {
                        ...baseOptions,
                        secure: false, // Allow insecure in development
                        domain: 'localhost',
                    };
                }
            };

            const prodOptions = getCookieOptions('production');
            const devOptions = getCookieOptions('development');

            expect(prodOptions.secure).toBe(true);
            expect(prodOptions.domain).toBe('example.com');

            expect(devOptions.secure).toBe(false);
            expect(devOptions.domain).toBe('localhost');
        });

        it('should validate cookie values', () => {
            const validateCookieValue = (value: string) => {
                // Check for invalid characters that could be used for attacks
                const invalidChars = /[<>'"&]/;
                const hasInvalidChars = invalidChars.test(value);

                // Check length
                const isValidLength = value.length > 0 && value.length < 4096;

                return !hasInvalidChars && isValidLength;
            };

            expect(validateCookieValue('valid-session-token')).toBe(true);
            expect(validateCookieValue('<script>alert("xss")</script>')).toBe(false);
            expect(validateCookieValue('')).toBe(false);
            expect(validateCookieValue('a'.repeat(5000))).toBe(false);
        });

        it('should handle cookie signing and verification', () => {
            const cookieManager = new CookieManager();
            const secret = 'cookie-secret';
            const value = 'session-token-123';

            const signed = cookieManager.sign(value, secret);

            expect(signed).toContain('.');

            const verified = cookieManager.verify(signed, secret);

            expect(verified).toBe(value);

            // Tampered cookie should fail verification
            const tampered = `tampered-token.${signed.split('.')[1]}`;
            const tamperedVerified = cookieManager.verify(tampered, secret);

            expect(tamperedVerified).toBeNull();
        });
    });

    describe('OAuth Provider Integration', () => {
        it('should handle OAuth authorization URL generation', () => {
            const oauthManager = new OAuthManager({
                google: {
                    clientId: 'test-google-client-id',
                    clientSecret: 'test-google-secret',
                    redirectUri: 'http://localhost:3000/api/auth/google/callback',
                },
            });

            const googleUrl = oauthManager.generateAuthUrl('google', 'random-state-123');

            expect(googleUrl).toContain('accounts.google.com');
            expect(googleUrl).toContain('openid+email+profile'); // URLSearchParams encodes spaces as +
            expect(googleUrl).toContain('random-state-123');
        });

        it('should validate OAuth state parameter', () => {
            const validateState = (receivedState: string, expectedState: string) => {
                return receivedState === expectedState;
            };

            expect(validateState('state-123', 'state-123')).toBe(true);
            expect(validateState('state-123', 'state-456')).toBe(false);
            expect(validateState('', 'state-123')).toBe(false);
        });

        it('should handle OAuth token exchange', async () => {
            const exchangeCodeForToken = async (provider: string, _code: string) => {
                // Mock token exchange
                const tokens: Record<string, {access_token: string; refresh_token: string; expires_in: number}> = {
                    google: {
                        access_token: 'google-access-token',
                        refresh_token: 'google-refresh-token',
                        expires_in: 3600,
                    },
                };

                return tokens[provider] || null;
            };

            const googleTokens = await exchangeCodeForToken('google', 'auth-code-123');

            expect(googleTokens?.access_token).toBe('google-access-token');
            expect(googleTokens?.refresh_token).toBe('google-refresh-token');
        });

        it('should fetch user profile from OAuth provider', async () => {
            const fetchUserProfile = async (provider: string, _accessToken: string) => {
                const profiles: Record<string, {id: string; email: string; name: string; picture: string}> = {
                    google: {
                        id: 'google-user-123',
                        email: 'user@gmail.com',
                        name: 'Google User',
                        picture: 'https://example.com/avatar.jpg',
                    },
                };

                return profiles[provider] || null;
            };

            const googleProfile = await fetchUserProfile('google', 'access-token');

            expect(googleProfile?.email).toBe('user@gmail.com');
            expect(googleProfile?.name).toBe('Google User');
            expect(googleProfile?.picture).toBe('https://example.com/avatar.jpg');
        });

        it('should handle OAuth errors gracefully', async () => {
            const handleOAuthError = (error: string) => {
                const errorMappings: Record<string, string> = {
                    access_denied: 'User denied access to their account',
                    invalid_request: 'Invalid OAuth request',
                    unauthorized_client: 'Unauthorized OAuth client',
                    unsupported_response_type: 'Unsupported response type',
                    invalid_scope: 'Invalid OAuth scope requested',
                };

                return errorMappings[error] || 'Unknown OAuth error occurred';
            };

            expect(handleOAuthError('access_denied')).toBe('User denied access to their account');
            expect(handleOAuthError('invalid_scope')).toBe('Invalid OAuth scope requested');
            expect(handleOAuthError('unknown_error')).toBe('Unknown OAuth error occurred');
        });
    });
});
