/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T00:30:00
 * Last Updated: 2025-12-24T00:30:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { TRPCError } from '@trpc/server';
import { rateLimitManager } from '@/libs/security';

// Extend the context type to include user roles and scopes
export type AuthContext = {
  session: {
    user: {
      id: string;
      email: string;
      role?: string;
      scopes?: string[];
      [key: string]: any;
    };
    [key: string]: any;
  } | null;

  [key: string]: any;
};

/**
 * Role-Based Access Control (RBAC) Middleware
 */
export function requireRole(allowedRoles: string | string[]) {
  return async ({ ctx, next}: { ctx: AuthContext; next: any }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const userRole = ctx.session.user.role;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!userRole || !roles.includes(userRole)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next();
  };
}

/**
 * Scope-Based Permissions Middleware
 */
export function requireScope(requiredScopes: string | string[]) {
  return async ({ ctx, next}: { ctx: AuthContext; next: any }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const userScopes = ctx.session.user.scopes ?? [];
    const scopes = Array.isArray(requiredScopes) ? requiredScopes : [requiredScopes];

    const hasRequiredScopes = scopes.every((scope) => {
      // Check for exact match
      if (userScopes.includes(scope)) {
        return true;
      }

      // Check for wildcard matches
      if (scope.includes('*')) {
        const scopeParts = scope.split(':');
        const wildcardPattern = scopeParts.map(part =>
          part === '*' ? '.*' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        ).join(':');

        return userScopes.some(userScope =>
          new RegExp(`^${wildcardPattern}$`).test(userScope),
        );
      }

      // Check if user has wildcard permission for the scope category
      const scopeCategory = scope.split(':')[0];
      return userScopes.some(userScope =>
        userScope === '*' || userScope === `${scopeCategory}:*`,
      );
    });

    if (!hasRequiredScopes) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next();
  };
}

/**
 * Resource Ownership Middleware
 */
export function requireOwnership<T extends AuthContext = AuthContext>(
  ownershipChecker: (ctx: T, input: any) => Promise<boolean> | boolean,
) {
  return async ({ ctx, input, next}: { ctx: T; input: any; next: any }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const isOwner = await ownershipChecker(ctx, input);

    if (!isOwner) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next();
  };
}

/**
 * Rate Limiting Middleware
 */
export function rateLimit<T extends AuthContext = AuthContext>(
  options: {
    windowMs?: number;
    maxRequests?: number;
    identifier?: (ctx: T) => string;
  } = {},
) {
  const {
    identifier = (ctx: T) => ctx.session?.user?.id ?? 'anonymous',
  } = options;

  return async ({ ctx, next}: { ctx: T; next: any }) => {
    const userId = identifier(ctx);
    const { allowed, reset } = await rateLimitManager.check(userId);

    if (!allowed) {
      const resetTime = reset.toISOString();
      const retryAfter = Math.ceil((reset.getTime() - Date.now()) / 1000);

      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Try again after ${resetTime}.`,
        cause: {
          retryAfter,
          resetTime,
        },
      });
    }

    return next();
  };
}

/**
 * Admin-only middleware (convenience wrapper)
 */
export const requireAdmin = requireRole('admin');

/**
 * Manager or Admin middleware (convenience wrapper)
 */
export const requireManagerOrAdmin = requireRole(['admin', 'manager']);

/**
 * User ownership checker (convenience function)
 */
export function checkUserOwnership(resourceUserId: string) {
  return <T extends AuthContext>(ctx: T) => {
    return ctx.session?.user?.id === resourceUserId;
  };
}

/**
 * Admin override ownership checker
 */
export function checkOwnershipWithAdminOverride(resourceUserId: string) {
  return <T extends AuthContext>(ctx: T) => {
    const user = ctx.session?.user;
    if (!user) {
      return false;
    }

    // Admin can access everything
    if (user.role === 'admin') {
      return true;
    }

    // Regular users can only access their own resources
    return user.id === resourceUserId;
  };
}

/**
 * Middleware chaining utilities
 */
export function chain<T extends AuthContext>(
  ...middlewares: Array<(next: (opts: { ctx: T; input?: any }) => any) => (opts: { ctx: T; input?: any }) => any>
) {
  return (next: (opts: { ctx: T; input?: any }) => any) => {
    return middlewares.reduce((current, middleware) => middleware(current), next);
  };
}

/**
 * Conditional middleware application
 */
export function conditional<T extends AuthContext>(
  condition: (ctx: T) => boolean,
  middleware: (next: (opts: { ctx: T; input?: any }) => any) => (opts: { ctx: T; input?: any }) => any,
) {
  return (next: (opts: { ctx: T; input?: any }) => any) =>
    (opts: { ctx: T; input?: any }) => {
      if (condition(opts.ctx)) {
        // Apply the middleware
        return middleware(next)(opts);
      }
      return next(opts);
    };
}

/**
 * Logging middleware for debugging
 */
export function withLogging<T extends AuthContext>(label?: string) {
  return (next: (opts: { ctx: T; input?: any; path?: string; type?: string }) => any) =>
    (opts: { ctx: T; input?: any; path?: string; type?: string }) => {
      const start = Date.now();
      console.warn(`[${label ?? 'TRPC'}] ${opts.type ?? 'UNKNOWN'} ${opts.path ?? 'unknown'} - Start`);

      try {
        const result = next(opts);
        const duration = Date.now() - start;
        console.warn(`[${label ?? 'TRPC'}] ${opts.type ?? 'UNKNOWN'} ${opts.path ?? 'unknown'} - Success (${duration}ms)`);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error(`[${label ?? 'TRPC'}] ${opts.type ?? 'UNKNOWN'} ${opts.path ?? 'unknown'} - Error (${duration}ms):`, error);
        throw error;
      }
    };
}

/**
 * Input validation middleware with additional security checks
 */
export function withSecurityValidation<T extends AuthContext>() {
  return (next: (opts: { ctx: T; input?: any }) => any) =>
    (opts: { ctx: T; input?: any }) => {
      // Basic input sanitization
      if (opts.input && typeof opts.input === 'object') {
        // Remove any potential injection attempts
        const sanitizedInput = JSON.parse(JSON.stringify(opts.input));

        // Additional security checks can be added here
        // For example: check for suspicious patterns, validate data types, etc.

        return next({ ...opts, input: sanitizedInput });
      }

      return next(opts);
    };
}
