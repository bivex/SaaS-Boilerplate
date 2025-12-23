/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:00:00
 * Last Updated: 2025-12-23T23:00:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { EnumValues } from './Enum';

export const ORG_ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type OrgRole = EnumValues<typeof ORG_ROLE>;

export const ORG_PERMISSION = {
  // Add Organization Permissions here
} as const;

export type OrgPermission = EnumValues<typeof ORG_PERMISSION>;

// Better Auth Types
export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: Date;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
};

export type Session = {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  user: User;
  organization?: Organization;
};
