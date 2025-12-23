/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T01:45:00
 * Last Updated: 2025-12-24T01:45:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { db } from './DB';
import { session } from '../models/Schema';
import { eq, lt, and, inArray } from 'drizzle-orm';
import { Redis } from '@upstash/redis';

// Session data structure
export interface SessionData {
  id: string;
  userId: string;
  token?: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    name?: string;
    roles?: string[];
    permissions?: string[];
    metadata?: Record<string, any>;
  };
}

// Storage adapter interface
export interface SessionStorageAdapter {
  store(session: SessionData): Promise<void>;
  retrieve(sessionId: string): Promise<SessionData | null>;
  update(sessionId: string, updates: Partial<SessionData>): Promise<void>;
  delete(sessionId: string): Promise<void>;
  cleanup(): Promise<void>;
  close(): Promise<void>;
}

// Database session storage adapter
export class DatabaseSessionStorage implements SessionStorageAdapter {
  async store(session: SessionData): Promise<void> {
    await db.insert(session).values({
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }).onConflictDoUpdate({
      target: session.id,
      set: {
        token: session.token,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        updatedAt: session.updatedAt,
      },
    });
  }

  async retrieve(sessionId: string): Promise<SessionData | null> {
    const result = await db
      .select()
      .from(session)
      .where(eq(session.id, sessionId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const sessionData = result[0];
    return {
      id: sessionData.id,
      userId: sessionData.userId,
      token: sessionData.token || undefined,
      expiresAt: sessionData.expiresAt,
      ipAddress: sessionData.ipAddress || undefined,
      userAgent: sessionData.userAgent || undefined,
      createdAt: sessionData.createdAt,
      updatedAt: sessionData.updatedAt,
    };
  }

  async update(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (updates.token !== undefined) updateData.token = updates.token;
    if (updates.expiresAt !== undefined) updateData.expiresAt = updates.expiresAt;
    if (updates.ipAddress !== undefined) updateData.ipAddress = updates.ipAddress;
    if (updates.userAgent !== undefined) updateData.userAgent = updates.userAgent;

    await db
      .update(session)
      .set(updateData)
      .where(eq(session.id, sessionId));
  }

  async delete(sessionId: string): Promise<void> {
    await db.delete(session).where(eq(session.id, sessionId));
  }

  async cleanup(): Promise<void> {
    const now = new Date();
    await db.delete(session).where(lt(session.expiresAt, now));
  }

  async close(): Promise<void> {
    // Database connections are managed by the DB module
  }
}

// Redis session storage adapter
export class RedisSessionStorage implements SessionStorageAdapter {
  private redis: Redis;

  constructor(redisUrl?: string, redisToken?: string) {
    this.redis = new Redis({
      url: redisUrl || process.env.UPSTASH_REDIS_REST_URL || '',
      token: redisToken || process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
  }

  async store(session: SessionData): Promise<void> {
    const key = `session:${session.id}`;
    const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);

    await this.redis.set(key, JSON.stringify(session), { ex: ttl });
  }

  async retrieve(sessionId: string): Promise<SessionData | null> {
    const key = `session:${sessionId}`;
    const data = await this.redis.get<string>(key);

    if (!data) {
      return null;
    }

    try {
      const session = JSON.parse(data);
      // Convert date strings back to Date objects
      if (session.expiresAt) session.expiresAt = new Date(session.expiresAt);
      if (session.createdAt) session.createdAt = new Date(session.createdAt);
      if (session.updatedAt) session.updatedAt = new Date(session.updatedAt);

      return session;
    } catch (error) {
      console.error('Failed to parse session data from Redis:', error);
      return null;
    }
  }

  async update(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    const existing = await this.retrieve(sessionId);
    if (!existing) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    await this.store(updated);
  }

  async delete(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.redis.del(key);
  }

  async cleanup(): Promise<void> {
    // Redis handles TTL automatically, no manual cleanup needed
  }

  async close(): Promise<void> {
    // Redis connections are managed automatically
  }
}

// Hybrid storage strategy (Redis + Database)
export class HybridSessionStorage implements SessionStorageAdapter {
  private redis: RedisSessionStorage;
  private database: DatabaseSessionStorage;

  constructor(redisUrl?: string, redisToken?: string) {
    this.redis = new RedisSessionStorage(redisUrl, redisToken);
    this.database = new DatabaseSessionStorage();
  }

  async store(session: SessionData): Promise<void> {
    // Store in both Redis (for fast access) and database (for persistence)
    await Promise.allSettled([
      this.redis.store(session),
      this.database.store(session),
    ]);
  }

  async retrieve(sessionId: string): Promise<SessionData | null> {
    try {
      // Try Redis first for fast access
      const session = await this.redis.retrieve(sessionId);
      if (session) {
        return session;
      }
    } catch (error) {
      console.warn('Redis retrieval failed, falling back to database:', error);
    }

    // Fallback to database
    return this.database.retrieve(sessionId);
  }

  async update(sessionId: string, updates: Partial<SessionData>): Promise<void> {
    // Update both stores
    await Promise.allSettled([
      this.redis.update(sessionId, updates),
      this.database.update(sessionId, updates),
    ]);
  }

  async delete(sessionId: string): Promise<void> {
    // Delete from both stores
    await Promise.allSettled([
      this.redis.delete(sessionId),
      this.database.delete(sessionId),
    ]);
  }

  async cleanup(): Promise<void> {
    // Clean up database (Redis handles TTL automatically)
    await this.database.cleanup();
  }

  async close(): Promise<void> {
    await Promise.allSettled([
      this.redis.close(),
      this.database.close(),
    ]);
  }
}

// Session serialization utilities
export class SessionSerializer {
  /**
   * Serialize session data to string
   */
  static serialize(session: SessionData): string {
    // Handle Date objects
    const serializable = {
      ...session,
      expiresAt: session.expiresAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };

    return JSON.stringify(serializable);
  }

  /**
   * Deserialize session data from string
   */
  static deserialize(data: string): SessionData {
    const parsed = JSON.parse(data);

    // Convert ISO strings back to Date objects
    return {
      ...parsed,
      expiresAt: new Date(parsed.expiresAt),
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
  }

  /**
   * Check for circular references
   */
  static hasCircularReferences(obj: any): boolean {
    const seen = new WeakSet();
    const detect = (obj: any): boolean => {
      if (obj && typeof obj === 'object') {
        if (seen.has(obj)) {
          return true;
        }
        seen.add(obj);
        for (const key in obj) {
          if (detect(obj[key])) {
            return true;
          }
        }
      }
      return false;
    };
    return detect(obj);
  }

  /**
   * Safe serialization that handles circular references
   */
  static safeSerialize(session: SessionData): string {
    if (this.hasCircularReferences(session)) {
      throw new Error('Session data contains circular references');
    }

    return this.serialize(session);
  }
}

// Session storage factory
export class SessionStorageFactory {
  static create(type: 'database' | 'redis' | 'hybrid' = 'database'): SessionStorageAdapter {
    switch (type) {
      case 'redis':
        return new RedisSessionStorage();
      case 'hybrid':
        return new HybridSessionStorage();
      case 'database':
      default:
        return new DatabaseSessionStorage();
    }
  }
}

// Default session storage instance
export const sessionStorage = SessionStorageFactory.create(
  (process.env.SESSION_STORAGE_TYPE as 'database' | 'redis' | 'hybrid') || 'database'
);
