# SaaS Boilerplate - Implementation TODO

This document tracks features that have comprehensive test coverage but are awaiting implementation.

## Testing Status
- ✅ **52 tests passing** - Core functionality working
- ⏭️ **81 tests skipped** - Features pending implementation
- ❌ **11 tests failing** - Partial implementations or integration issues

---

## High Priority - Core Authentication Features

### 1. Authorization Middleware System
**Location**: `src/server/middleware.ts` (needs creation)
**Tests**: `src/server/middleware.test.ts` (72 tests skipped)

#### Role-Based Access Control (RBAC)
- [ ] Implement role-based middleware for tRPC procedures
- [ ] Support single role checks (`admin`, `user`, `manager`)
- [ ] Support multiple allowed roles
- [ ] Proper error handling with `FORBIDDEN` status

#### Scope-Based Permissions
- [ ] Implement scope/permission checking middleware
- [ ] Support granular permissions (e.g., `read:users`, `write:posts`)
- [ ] Support wildcard scopes (e.g., `*:admin`)
- [ ] Scope inheritance and composition

#### Resource Ownership Checks
- [ ] Implement resource ownership validation
- [ ] User can only access their own resources
- [ ] Admin override capabilities
- [ ] Proper context passing for ownership checks

#### Rate Limiting
- [ ] Implement rate limiting middleware
- [ ] Per-user rate limits
- [ ] Per-endpoint rate limits
- [ ] Redis-based rate limit storage (optional)
- [ ] In-memory fallback for development

#### Middleware Chaining
- [ ] Support multiple middleware execution
- [ ] Proper middleware ordering
- [ ] Error propagation through middleware chain
- [ ] Short-circuit on middleware failure

**Estimated Effort**: 2-3 days

---

## High Priority - Security Components

### 2. Security Utilities
**Location**: `src/libs/security.ts` (needs creation)
**Tests**: `src/libs/security.test.ts` (23 tests skipped)

#### JWT Management
- [ ] JWT signing with configurable algorithms
- [ ] JWT verification with proper error handling
- [ ] JWT refresh token mechanism
- [ ] Token expiration handling
- [ ] Blacklist/revocation support

#### Password Security
- [ ] Argon2 password hashing
- [ ] Password strength validation
- [ ] Secure password comparison (timing-safe)
- [ ] Password reset token generation

#### CSRF Protection
- [ ] CSRF token generation
- [ ] CSRF token validation
- [ ] Token storage strategy
- [ ] Double-submit cookie pattern

#### OAuth Integration
- [ ] OAuth authorization URL generation
- [ ] OAuth callback handling
- [ ] State parameter validation
- [ ] Token exchange implementation

**Estimated Effort**: 2-3 days

---

## Medium Priority - Session Management

### 3. Advanced Session Management
**Location**: `src/libs/session.ts` (needs enhancement)
**Tests**: `src/libs/session.test.ts` (13 tests skipped)

#### Session Refresh
- [ ] Automatic session refresh when close to expiration
- [ ] Configurable refresh threshold (e.g., 15 minutes before expiry)
- [ ] Handle refresh failures gracefully
- [ ] Update UI state after refresh

#### Session Expiration
- [ ] Detect expired sessions
- [ ] Auto-logout on expiration
- [ ] Redirect to login page
- [ ] Preserve intended destination for post-login redirect

#### Error Handling
- [ ] Handle 401 Unauthorized errors
- [ ] Handle 403 Forbidden errors
- [ ] Handle invalid token errors
- [ ] Handle network errors during session validation
- [ ] Handle malformed session data

#### Session Persistence
- [ ] Persist session across component re-mounts
- [ ] Handle concurrent session requests (deduplication)
- [ ] Session state synchronization across tabs

**Estimated Effort**: 1-2 days

---

## Medium Priority - Session Storage

### 4. Session Storage Adapters
**Location**: `src/libs/session-storage.ts` (needs creation)
**Tests**: `src/libs/session-storage.test.ts` (20 tests skipped)

#### Database Session Storage
- [ ] Store sessions in database (SQLite/PostgreSQL)
- [ ] Retrieve sessions by ID
- [ ] Update session data
- [ ] Delete expired sessions (cleanup job)
- [ ] Handle database connection failures
- [ ] Transaction support for session operations

#### Redis Session Storage
- [ ] Connect to Redis on initialization
- [ ] Store sessions with TTL (Time To Live)
- [ ] Retrieve sessions from Redis
- [ ] Handle Redis connection failures
- [ ] Automatic key expiration (cleanup)
- [ ] Graceful fallback when Redis unavailable

#### Hybrid Storage Strategy
- [ ] Use Redis for hot data (active sessions)
- [ ] Use database for persistence (backup)
- [ ] Sync between Redis and database
- [ ] Fallback to database when Redis fails
- [ ] Configurable storage strategy

#### Session Serialization
- [ ] Serialize complex session objects (JSON)
- [ ] Handle circular references in session data
- [ ] Handle Date objects in serialization
- [ ] Compress large session payloads (optional)
- [ ] Validate deserialized data

**Estimated Effort**: 2-3 days

---

## Low Priority - Configuration & Testing

### 5. Better Auth Configuration
**Location**: `src/libs/auth.ts` (needs enhancement)
**Tests**: `src/libs/auth.test.ts` (24 tests skipped)

#### Email/Password Authentication
- [ ] Verify email/password provider is configured
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Email templates

#### Social Providers
- [ ] Google OAuth configuration
- [ ] GitHub OAuth configuration
- [ ] Verify credentials are set
- [ ] Handle provider-specific errors

#### Environment Variables
- [ ] Validate all required env vars are set
- [ ] Provide helpful error messages for missing vars
- [ ] Support for .env files
- [ ] Environment-specific configurations

#### Plugin System
- [ ] Support Better Auth plugins
- [ ] Plugin configuration API
- [ ] Plugin lifecycle management

**Estimated Effort**: 1-2 days

---

## Low Priority - Security Testing

### 6. Security Test Implementations
**Location**: Various security utilities
**Tests**: `tests/security/auth-security.test.ts` (34 tests skipped)

#### XSS Prevention
- [ ] Input sanitization for email fields
- [ ] Output escaping for error messages
- [ ] URL validation for redirects
- [ ] Implement sanitization utilities

#### SQL Injection Prevention
- [ ] Verify parameterized queries are used
- [ ] Input validation for user data
- [ ] Detect and block SQL injection attempts

#### Token Leakage Prevention
- [ ] Mask tokens in error messages
- [ ] Mask tokens in logs
- [ ] Sanitize error responses
- [ ] Never expose tokens in URLs

#### Authorization Bypass Prevention
- [ ] Enforce RBAC correctly
- [ ] Prevent parameter manipulation attacks
- [ ] Validate resource access permissions
- [ ] Prevent directory traversal

#### Session Security
- [ ] Prevent session fixation attacks
- [ ] Detect session hijacking attempts
- [ ] Implement session expiration
- [ ] Prevent concurrent session abuse

**Estimated Effort**: 2-3 days

---

## Low Priority - Performance

### 7. Performance Optimizations
**Location**: Various
**Tests**: `tests/performance/auth-performance.test.ts` (15 tests skipped)

#### Middleware Overhead
- [ ] Minimize overhead for unprotected routes
- [ ] Efficient auth checks for protected routes
- [ ] Scale with concurrent requests
- [ ] Implement session caching

#### Session Lookup Latency
- [ ] Fast database session retrieval (indexed queries)
- [ ] Session cache hits should be instant
- [ ] Maintain performance under load
- [ ] Database query optimization

#### Concurrent Authentication
- [ ] Handle multiple simultaneous sign-ins
- [ ] Prevent race conditions in session creation
- [ ] Maintain data consistency under concurrent load

#### Memory Management
- [ ] Clean up expired sessions efficiently
- [ ] Prevent memory leaks with repeated operations
- [ ] Batch operations where possible

#### Caching
- [ ] Implement session caching layer
- [ ] Provide significant performance improvement (5x+ faster)
- [ ] Handle cache invalidation efficiently
- [ ] Maintain cache consistency

**Estimated Effort**: 2-3 days

---

## Component Fixes - Currently Failing Tests

### 8. Fix Component Tests
**Status**: 11 tests failing

#### UserButton Component
**File**: `src/components/UserButton.test.tsx`
- [ ] Fix loading state rendering
- [ ] Fix user avatar and menu display
- [ ] Fix navigation to profile page
- [ ] Fix navigation to organization page
- [ ] Fix sign out functionality

Issues: Components may need mock implementations or the tests need to be updated to match actual component behavior.

#### OrganizationSwitcher Component
**File**: `src/components/OrganizationSwitcher.test.tsx`
- [ ] Fix personal account display
- [ ] Fix organization dropdown menu
- [ ] Fix navigation to organization profile
- [ ] Fix hidePersonal prop behavior

Issues: Similar to UserButton - needs alignment between tests and implementation.

#### Auth Hooks
**File**: `src/hooks/useAuth.test.ts`
- [ ] Fix useUser hook when no session
- [ ] Ensure proper null handling

#### Snapshot Tests
**File**: `tests/snapshot/auth-snapshots.test.ts`
- [ ] Fix timestamp matching in error responses
- [ ] Fix timestamp matching in API responses
- [ ] Use `expect.any(String)` for dynamic timestamps

#### Integration Tests
**Files**: `src/integration/*.test.ts`
- [ ] Complete end-to-end auth flow implementation
- [ ] Fix database adapter initialization errors

**Estimated Effort**: 1 day

---

## Implementation Priority Recommendations

### Phase 1 - Foundation (Week 1)
1. Security Utilities (JWT, password hashing, CSRF)
2. Authorization Middleware (RBAC, permissions)
3. Fix failing component tests

### Phase 2 - Session Management (Week 2)
4. Advanced Session Management (refresh, expiration)
5. Session Storage Adapters (Database, Redis)

### Phase 3 - Configuration & Testing (Week 3)
6. Better Auth Configuration enhancements
7. Security test implementations
8. Performance optimizations

---

## Testing Commands

### Run all tests:
```bash
bunx --bun vitest run
```

### Run specific test file:
```bash
bunx --bun vitest run src/server/middleware.test.ts
```

### Run in watch mode:
```bash
bunx --bun vitest
```

### Update snapshots:
```bash
bunx --bun vitest run -u
```

### Run tests with coverage:
```bash
bunx --bun vitest run --coverage
```

---

## Notes

- All skipped tests are marked with `.skip` in their respective test files
- Each skipped test suite includes a comment explaining why it's skipped
- Tests use proper mocking and don't require external services (Redis, etc.) in test mode
- Re-enable tests by removing `.skip` after implementing the corresponding feature

---

## Related Documentation

- Better Auth: https://www.better-auth.com/docs
- tRPC: https://trpc.io/docs
- Vitest: https://vitest.dev/guide/
- Testing Library: https://testing-library.com/docs/react-testing-library/intro/

---

**Last Updated**: 2025-12-23
**Test Suite Version**: 193 total tests
**Next Review**: After Phase 1 completion
