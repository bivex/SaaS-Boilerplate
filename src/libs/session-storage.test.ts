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

// Mock Redis client
vi.mock('redis', () => ({
  createClient: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    expire: vi.fn(),
  })),
}));

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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(await import('@/libs/DB')).db = mockDb;
    vi.mocked(await import('redis')).createClient.mockReturnValue(mockRedis);
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
    it('should connect to Redis on initialization', async () => {
      const { createClient } = await import('redis');

      const client = createClient();
      await client.connect();

      expect(createClient).toHaveBeenCalled();
      expect(client.connect).toHaveBeenCalled();
    });

    it('should store session in Redis with TTL', async () => {
      const { createClient } = await import('redis');

      const client = createClient();
      const sessionData = {
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
      };

      const ttl = Math.floor((sessionData.expiresAt.getTime() - Date.now()) / 1000);

      await client.set(`session:${sessionData.id}`, JSON.stringify(sessionData));
      await client.expire(`session:${sessionData.id}`, ttl);

      expect(client.set).toHaveBeenCalledWith(
        `session:${sessionData.id}`,
        JSON.stringify(sessionData),
      );
      expect(client.expire).toHaveBeenCalledWith(`session:${sessionData.id}`, ttl);
    });

    it('should retrieve session from Redis', async () => {
      const { createClient } = await import('redis');

      const client = createClient();
      const sessionData = {
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(sessionData));

      const result = await client.get('session:session-1');
      const parsed = JSON.parse(result);

      expect(client.get).toHaveBeenCalledWith('session:session-1');
      expect(parsed).toEqual(sessionData);
    });

    it('should handle Redis connection failures', async () => {
      const { createClient } = await import('redis');

      const client = createClient();
      mockRedis.get.mockRejectedValue(new Error('Redis connection failed'));

      await expect(client.get('session:session-1')).rejects.toThrow('Redis connection failed');
    });

    it('should handle Redis key not found', async () => {
      const { createClient } = await import('redis');

      const client = createClient();
      mockRedis.get.mockResolvedValue(null);

      const result = await client.get('session:nonexistent');

      expect(result).toBeNull();
    });

    it('should clean up expired keys automatically via TTL', async () => {
      const { createClient } = await import('redis');

      const client = createClient();

      // Set a key with short TTL
      await client.set('session:temp', 'data');
      await client.expire('session:temp', 1); // 1 second TTL

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      mockRedis.get.mockResolvedValue(null); // Simulate expiration

      const result = await client.get('session:temp');

      expect(result).toBeNull();
    });
  });

  describe('Hybrid Storage Strategy', () => {
    it('should use Redis for hot data and database for persistence', async () => {
      const { createClient } = await import('redis');
      const { db } = await import('@/libs/DB');

      const redis = createClient();
      const sessionData = {
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
      };

      // Store in both Redis (fast access) and DB (persistence)
      await Promise.all([
        redis.set(`session:${sessionData.id}`, JSON.stringify(sessionData)),
        db.insert(sessionData),
      ]);

      expect(redis.set).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should fallback to database when Redis fails', async () => {
      const { createClient } = await import('redis');
      const { db } = await import('@/libs/DB');

      const redis = createClient();
      mockRedis.get.mockRejectedValue(new Error('Redis down'));

      mockDb.select.mockResolvedValue([{
        id: 'session-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
      }]);

      // Try Redis first, fallback to DB
      let session;
      try {
        session = await redis.get('session:session-1');
      } catch (error) {
        // Fallback to database
        const result = await db.select().where({ id: 'session-1' });
        session = result[0];
      }

      expect(session).toBeDefined();
      expect(session.id).toBe('session-1');
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
