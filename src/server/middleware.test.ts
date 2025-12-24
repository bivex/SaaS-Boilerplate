/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T00:45:00
 * Last Updated: 2025-12-24T01:03:42
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import {TRPCError} from '@trpc/server';
import {describe, expect, it, vi} from 'vitest';
import {rateLimit, requireOwnership, requireRole, requireScope} from './middleware';

// Mock environment variables
vi.mock('@/libs/Env', () => ({
    Env: {
        BETTER_AUTH_SECRET: 'test-secret',
        BETTER_AUTH_URL: 'http://localhost:3000',
        DATABASE_URL: './sqlite.db',
    },
}));

// Mock the database
vi.mock('@/libs/DB', () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

// Mock the rate limit manager - must be a factory function
vi.mock('@/libs/security', () => ({
    rateLimitManager: {
        check: vi.fn().mockResolvedValue({
            allowed: true,
            reset: new Date(Date.now() + 900000),
        }),
    },
}));

describe('Authorization Middleware', () => {
    describe('Role-Based Access Control (RBAC)', () => {
        it('should allow access for admin role', async () => {
            const middleware = requireRole('admin');
            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'admin@example.com', role: 'admin'},
                },
            };

            const next = vi.fn().mockResolvedValue('success');
            const result = await middleware({ctx: mockContext, next});

            expect(next).toHaveBeenCalled();
            expect(result).toBe('success');
        });

        it('should deny access for non-admin role', async () => {
            const middleware = requireRole('admin');
            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'user@example.com', role: 'user'},
                },
            };

            const next = vi.fn().mockResolvedValue('success');

            await expect(middleware({ctx: mockContext, next})).rejects.toThrow(TRPCError);
            expect(next).not.toHaveBeenCalled();
        });

        it('should allow access for multiple allowed roles', async () => {
            const middleware = requireRole(['admin', 'manager']);
            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'manager@example.com', role: 'manager'},
                },
            };

            const next = vi.fn().mockResolvedValue('success');
            const result = await middleware({ctx: mockContext, next});

            expect(next).toHaveBeenCalled();
            expect(result).toBe('success');
        });
    });

    describe('Scope-Based Permissions', () => {
        it('should allow access with required scope', async () => {
            const middleware = requireScope('read:users');
            const mockContext = {
                session: {
                    user: {
                        id: 'user-1',
                        email: 'user@example.com',
                        scopes: ['read:users', 'write:posts'],
                    },
                },
            };

            const next = vi.fn().mockResolvedValue('success');
            const result = await middleware({ctx: mockContext, next});

            expect(next).toHaveBeenCalled();
            expect(result).toBe('success');
        });

        it('should deny access without required scope', async () => {
            const middleware = requireScope('admin:delete');
            const mockContext = {
                session: {
                    user: {
                        id: 'user-1',
                        email: 'user@example.com',
                        scopes: ['read:users', 'write:posts'],
                    },
                },
            };

            const next = vi.fn().mockResolvedValue('success');

            await expect(middleware({ctx: mockContext, next})).rejects.toThrow(TRPCError);
            expect(next).not.toHaveBeenCalled();
        });

        it('should allow access with wildcard scope', async () => {
            const middleware = requireScope('admin:*');
            const mockContext = {
                session: {
                    user: {
                        id: 'user-1',
                        email: 'admin@example.com',
                        scopes: ['admin:*'],
                    },
                },
            };

            const next = vi.fn().mockResolvedValue('success');
            const result = await middleware({ctx: mockContext, next});

            expect(next).toHaveBeenCalled();
            expect(result).toBe('success');
        });
    });

    describe('Resource Ownership Checks', () => {
        it('should allow access to owned resources', async () => {
            const middleware = requireOwnership((ctx, _input) => {
                // Simulate database check for resource ownership
                const resourceOwnerId = 'user-1'; // Would come from DB
                return ctx.session?.user?.id === resourceOwnerId;
            });

            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'user@example.com'},
                },
            };

            const input = {resourceId: 'resource-1'};
            const next = vi.fn().mockResolvedValue('success');
            const result = await middleware({ctx: mockContext, input, next});

            expect(next).toHaveBeenCalled();
            expect(result).toBe('success');
        });

        it('should deny access to non-owned resources', async () => {
            const middleware = requireOwnership((ctx, _input) => {
                const resourceOwnerId = 'user-2'; // Different owner
                return ctx.session?.user?.id === resourceOwnerId;
            });

            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'user@example.com'},
                },
            };

            const input = {resourceId: 'resource-1'};
            const next = vi.fn().mockResolvedValue('success');

            await expect(middleware({ctx: mockContext, input, next})).rejects.toThrow(TRPCError);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Rate Limiting Middleware', () => {
        it('should allow requests within rate limit', async () => {
            const {rateLimitManager} = await import('@/libs/security');

            // Mock rate limit check to allow request
            (rateLimitManager.check as any).mockResolvedValue({
                allowed: true,
                reset: new Date(Date.now() + 900000),
            });

            const middleware = rateLimit();
            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'user@example.com'},
                },
            };

            const next = vi.fn().mockResolvedValue('success');
            const result = await middleware({ctx: mockContext, next});

            expect(result).toBe('success');
            expect(rateLimitManager.check).toHaveBeenCalledWith('user-1');
            expect(next).toHaveBeenCalled();
        });

        it('should block requests over rate limit', async () => {
            const {rateLimitManager} = await import('@/libs/security');

            // Mock rate limit check to block request
            (rateLimitManager.check as any).mockResolvedValue({
                allowed: false,
                reset: new Date(Date.now() + 900000),
            });

            const middleware = rateLimit();
            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'user@example.com'},
                },
            };

            const next = vi.fn().mockResolvedValue('success');

            await expect(middleware({ctx: mockContext, next})).rejects.toThrow(TRPCError);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Chained Middleware', () => {
        it('should execute middleware in correct order', async () => {
            const executionOrder: string[] = [];

            const middleware1 = async ({next}: any) => {
                executionOrder.push('middleware1');
                return next();
            };

            const middleware2 = async ({next}: any) => {
                executionOrder.push('middleware2');
                return next();
            };

            const middleware3 = async ({next}: any) => {
                executionOrder.push('middleware3');
                return next();
            };

            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'user@example.com'},
                },
            };

            // Chain the middleware: middleware1 -> middleware2 -> middleware3 -> resolver
            const resolver = vi.fn().mockImplementation(() => {
                executionOrder.push('resolver');
                return 'chained result';
            });

            const chain3 = () => middleware3({ctx: mockContext, next: resolver});
            const chain2 = () => middleware2({ctx: mockContext, next: chain3});
            const chain1 = () => middleware1({ctx: mockContext, next: chain2});

            await chain1();

            expect(executionOrder).toEqual(['middleware1', 'middleware2', 'middleware3', 'resolver']);
        });

        it('should stop execution on middleware error', async () => {
            const executionOrder: string[] = [];

            const middleware1 = async ({next}: any) => {
                executionOrder.push('middleware1');
                return next();
            };

            const failingMiddleware = async ({next: _next}: any) => {
                executionOrder.push('middleware2');
                throw new TRPCError({code: 'FORBIDDEN'});
            };

            const mockContext = {
                session: {
                    user: {id: 'user-1', email: 'user@example.com'},
                },
            };

            // Test that middleware1 executes
            const next1 = vi.fn().mockResolvedValue('success');
            await middleware1({ctx: mockContext, next: next1});
            expect(executionOrder).toContain('middleware1');

            // Test that failing middleware throws
            await expect(failingMiddleware({ctx: mockContext, next: vi.fn()})).rejects.toThrow(TRPCError);
            expect(executionOrder).toContain('middleware2');

            // middleware3 should not have been reached
            expect(executionOrder).not.toContain('middleware3');
        });
    });
});
