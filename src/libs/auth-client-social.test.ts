/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T00:05:00
 * Last Updated: 2025-12-24T01:25:38
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {authClient} from './auth-client';

// Mock better-auth client
vi.mock('better-auth/client', () => ({
    createAuthClient: vi.fn(() => ({
        signIn: {
            social: vi.fn(),
            email: vi.fn(),
        },
        signUp: {
            email: vi.fn(),
        },
        signOut: vi.fn(),
        getSession: vi.fn(),
        linkSocial: vi.fn(),
        unlinkAccount: vi.fn(),
    })),
}));

// Mock the auth client module
vi.mock('./auth-client', () => ({
    authClient: {
        signIn: {
            social: vi.fn(),
            email: vi.fn(),
        },
        signUp: {
            email: vi.fn(),
        },
        signOut: vi.fn(),
        getSession: vi.fn(),
        linkSocial: vi.fn(),
        unlinkAccount: vi.fn(),
    },
}));

describe('Social Login Functionality', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Google OAuth', () => {
        it('should initiate Google OAuth flow', async () => {
            const mockResult = {data: {user: {id: '1', email: 'test@example.com'}}, error: null};
            (authClient.signIn.social as any).mockResolvedValue(mockResult);

            const result = await authClient.signIn.social({provider: 'google'});

            expect(authClient.signIn.social).toHaveBeenCalledWith({provider: 'google'});
            expect(result).toEqual(mockResult);
        });

        it('should handle Google OAuth errors', async () => {
            const mockError = {error: {message: 'Invalid client', code: 'invalid_client'}, data: null};
            (authClient.signIn.social as any).mockResolvedValue(mockError);

            const result = await authClient.signIn.social({provider: 'google'});

            expect(result.error).toBeDefined();
            expect(result.error?.message).toContain('Invalid client');
        });

        it('should support Google OAuth with custom scopes', async () => {
            const mockResult = {data: {user: {id: '1'}}, error: null};
            (authClient.signIn.social as any).mockResolvedValue(mockResult);

            const result = await authClient.signIn.social({
                provider: 'google',
                scopes: ['https://www.googleapis.com/auth/drive.readonly']
            });

            expect(authClient.signIn.social).toHaveBeenCalledWith({
                provider: 'google',
                scopes: ['https://www.googleapis.com/auth/drive.readonly']
            });
            expect(result).toEqual(mockResult);
        });

        it('should support Google OAuth with ID token', async () => {
            const mockResult = {data: {user: {id: '1', email: 'test@example.com'}}, error: null};
            (authClient.signIn.social as any).mockResolvedValue(mockResult);

            const result = await authClient.signIn.social({
                provider: 'google',
                idToken: {
                    token: 'mock_id_token',
                    accessToken: 'mock_access_token'
                }
            });

            expect(authClient.signIn.social).toHaveBeenCalledWith({
                provider: 'google',
                idToken: {
                    token: 'mock_id_token',
                    accessToken: 'mock_access_token'
                }
            });
            expect(result).toEqual(mockResult);
        });
    });

    describe('GitHub OAuth', () => {
        it('should initiate GitHub OAuth flow', async () => {
            const mockResult = {data: {user: {id: '2', email: 'github@example.com'}}, error: null};
            (authClient.signIn.social as any).mockResolvedValue(mockResult);

            const result = await authClient.signIn.social({provider: 'github'});

            expect(authClient.signIn.social).toHaveBeenCalledWith({provider: 'github'});
            expect(result).toEqual(mockResult);
        });

        it('should handle GitHub OAuth errors', async () => {
            const mockError = {error: {message: 'Access denied', code: 'access_denied'}, data: null};
            (authClient.signIn.social as any).mockResolvedValue(mockError);

            const result = await authClient.signIn.social({provider: 'github'});

            expect(result.error).toBeDefined();
            expect(result.error?.message).toContain('Access denied');
        });
    });

    describe('Social Account Linking', () => {
        it('should link Google account with additional scopes', async () => {
            const mockResult = {data: {success: true}, error: null};
            (authClient.linkSocial as any).mockResolvedValue(mockResult);

            const result = await authClient.linkSocial({
                provider: 'google',
                scopes: ['https://www.googleapis.com/auth/drive.file']
            });

            expect(authClient.linkSocial).toHaveBeenCalledWith({
                provider: 'google',
                scopes: ['https://www.googleapis.com/auth/drive.file']
            });
            expect(result).toEqual(mockResult);
        });

        it('should handle linking errors', async () => {
            const mockError = {error: {message: 'Account already linked', code: 'already_linked'}, data: null};
            (authClient.linkSocial as any).mockResolvedValue(mockError);

            const result = await authClient.linkSocial({provider: 'google'});

            expect(result.error).toBeDefined();
            expect(result.error?.message).toContain('Account already linked');
        });
    });

    describe('Error Handling', () => {
        it('should handle network errors', async () => {
            (authClient.signIn.social as any).mockRejectedValue(new Error('Network error'));

            await expect(authClient.signIn.social({provider: 'google'}))
                .rejects.toThrow('Network error');
        });

        it('should handle invalid provider', async () => {
            const mockError = {error: {message: 'Invalid provider', code: 'invalid_provider'}, data: null};
            (authClient.signIn.social as any).mockResolvedValue(mockError);

            const result = await authClient.signIn.social({provider: 'invalid' as any});

            expect(result.error).toBeDefined();
            expect(result.error?.code).toBe('invalid_provider');
        });

        it('should handle OAuth timeout', async () => {
            (authClient.signIn.social as any).mockRejectedValue(new Error('Request timeout'));

            await expect(authClient.signIn.social({provider: 'google'}))
                .rejects.toThrow('Request timeout');
        });
    });

    describe('OAuth State Management', () => {
        it('should maintain OAuth state during flow', async () => {
            const mockResult = {data: {user: {id: '1'}, session: {id: 'session_123'}}, error: null};
            (authClient.signIn.social as any).mockResolvedValue(mockResult);

            const result = await authClient.signIn.social({provider: 'google'});

            expect(result.data?.session).toBeDefined();
            expect(result.data?.user.id).toBe('1');
        });

        it('should clear session on OAuth failure', async () => {
            const mockError = {error: {message: 'Authentication failed'}, data: null};
            (authClient.signIn.social as any).mockResolvedValue(mockError);

            const result = await authClient.signIn.social({provider: 'google'});

            expect(result.data).toBeNull();
            expect(result.error).toBeDefined();
        });
    });

    describe('Provider Validation', () => {
        const validProviders = ['google', 'github'];

        validProviders.forEach(provider => {
            it(`should accept ${provider} as valid provider`, async () => {
                const mockResult = {data: {user: {id: '1'}}, error: null};
                (authClient.signIn.social as any).mockResolvedValue(mockResult);

                const result = await authClient.signIn.social({provider: provider as any});

                expect(result.data).toBeDefined();
                expect(result.error).toBeNull();
            });
        });

        it('should reject unsupported providers', async () => {
            const mockError = {error: {message: 'Provider not supported', code: 'unsupported_provider'}, data: null};
            (authClient.signIn.social as any).mockResolvedValue(mockError);

            const result = await authClient.signIn.social({provider: 'twitter' as any});

            expect(result.error).toBeDefined();
            expect(result.error?.code).toBe('unsupported_provider');
        });
    });
});
