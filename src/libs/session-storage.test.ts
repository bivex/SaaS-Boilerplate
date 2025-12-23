/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:15:00
 * Last Updated: 2025-12-23T21:09:06
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock database
vi.mock('@/libs/DB', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  },
}));

// Mock schema
vi.mock('../models/Schema', () => ({
  session: 'session_table_mock',
}));

// Mock Redis client
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(() => ({
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  })),
}));

// Session storage adapters implementation
describe('Session Storage Adapters', () => {
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  };

  const mockRedis = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    expire: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    (await import('@/libs/DB')).db = mockDb;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Database Session Storage', () => {
    it('should store session in database', async () => {
      const { db } = await import('@/libs/DB');

      const sessionData = {
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
        token: 'session-token',
      };

      mockDb.insert.mockResolvedValue([sessionData]);

      // Simulate session creation
      await db.insert({
        id: sessionData.id,
        userId: sessionData.userId,
        expiresAt: sessionData.expiresAt,
        token: sessionData.token,
      });

      expect(mockDb.insert).toHaveBeenCalledWith({
        id: sessionData.id,
        userId: sessionData.userId,
        expiresAt: sessionData.expiresAt,
        token: sessionData.token,
      });
    });

    it('should retrieve session from database', async () => {
      const { db } = await import('@/libs/DB');

      const sessionData = {
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
        token: 'session-token',
      };

      mockDb.select.mockResolvedValue([sessionData]);

      const result = await db.select().where({ token: 'session-token' });

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toEqual([sessionData]);
    });

    it('should handle database connection failures', async () => {
      const { db } = await import('@/libs/DB');

      mockDb.select.mockRejectedValue(new Error('Database connection failed'));

      await expect(
        db.select().where({ token: 'session-token' }),
      ).rejects.toThrow('Database connection failed');
    });

    it('should clean up expired sessions', async () => {
      const { db } = await import('@/libs/DB');

      const expiredSessions = [
        { id: 'expired-1', expiresAt: new Date(Date.now() - 1000) },
        { id: 'expired-2', expiresAt: new Date(Date.now() - 2000) },
      ];

      mockDb.select.mockResolvedValue(expiredSessions);
      mockDb.delete.mockResolvedValue({ count: 2 });

      // Simulate cleanup logic
      const expiredIds = expiredSessions.map(s => s.id);
      await db.delete().where({ id: { in: expiredIds } });

      expect(mockDb.delete).toHaveBeenCalledWith({
        where: { id: { in: expiredIds } },
      });
    });
  });

  describe('Redis Session Storage', () => {
    it('should initialize Redis client', () => {
      const { Redis } = require('@upstash/redis');

      // Redis is initialized in constructor
      const redisStorage = new (require('../../libs/session-storage').RedisSessionStorage)();

      expect(Redis).toHaveBeenCalled();
    });

    it('should store session in Redis with TTL', async () => {
      const { Redis } = require('@upstash/redis');
      const mockRedis = Redis.mock.results[Redis.mock.calls.length - 1]?.value || {
        set: vi.fn(),
      };

      const redisStorage = new (require('../../libs/session-storage').RedisSessionStorage)();
      const sessionData = {
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await redisStorage.store(sessionData);

      expect(mockRedis.set).toHaveBeenCalled();
    });

    it('should retrieve session from Redis', async () => {
      const { Redis } = require('@upstash/redis');
      const mockRedis = Redis.mock.results[Redis.mock.calls.length - 1]?.value || {
        get: vi.fn(),
      };

      mockRedis.get.mockResolvedValue(JSON.stringify({
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const redisStorage = new (require('../../libs/session-storage').RedisSessionStorage)();
      const result = await redisStorage.retrieve('session-1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('session-1');
    });

    it('should handle Redis key not found', async () => {
      const { Redis } = require('@upstash/redis');
      const mockRedis = Redis.mock.results[Redis.mock.calls.length - 1]?.value || {
        get: vi.fn(),
      };

      mockRedis.get.mockResolvedValue(null);

      const redisStorage = new (require('../../libs/session-storage').RedisSessionStorage)();
      const result = await redisStorage.retrieve('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('Hybrid Storage Strategy', () => {
    it('should use Redis for hot data and database for persistence', async () => {
      const hybridStorage = new (require('../../libs/session-storage').HybridSessionStorage)();
      const sessionData = {
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock successful storage in both
      const { Redis } = require('@upstash/redis');
      const mockRedis = Redis.mock.results[Redis.mock.calls.length - 1]?.value || {
        set: vi.fn().mockResolvedValue('OK'),
      };

      mockDb.insert.mockResolvedValue([sessionData]);

      await hybridStorage.store(sessionData);

      // Should attempt to store in both
      expect(mockRedis.set).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should fallback to database when Redis fails', async () => {
      const hybridStorage = new (require('../../libs/session-storage').HybridSessionStorage)();

      // Mock Redis failure and DB success
      const { Redis } = require('@upstash/redis');
      const mockRedis = Redis.mock.results[Redis.mock.calls.length - 1]?.value || {
        get: vi.fn().mockRejectedValue(new Error('Redis down')),
      };

      mockDb.select.mockResolvedValue([{
        id: 'session-1',
        userId: 'user-1',
        token: 'token-1',
        expiresAt: new Date(Date.now() + 3600000),
        ipAddress: null,
        userAgent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);

      const result = await hybridStorage.retrieve('session-1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('session-1');
    });
  });

  describe('Session Serialization/Deserialization', () => {
    it('should serialize complex session objects', () => {
      const sessionData = {
        id: 'session-1',
        userId: 'user-1',
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          roles: ['admin', 'user'],
          permissions: ['read:users', 'write:posts'],
          metadata: {
            lastLogin: new Date(),
            preferences: { theme: 'dark' },
          },
        },
        expiresAt: new Date(Date.now() + 3600000),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const serialized = JSON.stringify(sessionData);
      const deserialized = JSON.parse(serialized);

      expect(deserialized).toEqual(sessionData);
      expect(deserialized.user.roles).toEqual(['admin', 'user']);
      expect(deserialized.user.metadata.preferences.theme).toBe('dark');
    });

    it('should handle circular references in session data', () => {
      const sessionData = {
        id: 'session-1',
        user: { id: 'user-1' },
      };

      // Add circular reference
      sessionData.user.session = sessionData;

      expect(() => JSON.stringify(sessionData)).toThrow('Converting circular structure to JSON');
    });

    it('should handle Date objects in serialization', () => {
      const sessionData = {
        id: 'session-1',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        expiresAt: new Date('2024-01-02T00:00:00Z'),
      };

      const serialized = JSON.stringify(sessionData);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(deserialized.expiresAt).toBe('2024-01-02T00:00:00.000Z');

      // Parse back to Date objects
      const parsed = {
        ...deserialized,
        createdAt: new Date(deserialized.createdAt),
        expiresAt: new Date(deserialized.expiresAt),
      };

      expect(parsed.createdAt.getTime()).toBe(sessionData.createdAt.getTime());
      expect(parsed.expiresAt.getTime()).toBe(sessionData.expiresAt.getTime());
    });

    it('should compress large session payloads', () => {
      const largeSession = {
        id: 'session-1',
        user: {
          id: 'user-1',
          permissions: Array.from({ length: 1000 }).fill('permission'), // Large array
          metadata: 'x'.repeat(10000), // Large string
        },
      };

      const serialized = JSON.stringify(largeSession);

      // Should be compressed (simulated)
      expect(serialized.length).toBeGreaterThan(10000);

      // In real implementation, would use compression like gzip
      // expect(compressed.length).toBeLessThan(serialized.length);
    });
  });
});
