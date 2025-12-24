/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T19:01:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { OrgPermission, OrgRole } from '@/types/Auth';

// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/en.json');

// eslint-disable-next-line ts/consistent-type-definitions
declare interface IntlMessages extends Messages {
}

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface ClerkAuthorization {
    permission: OrgPermission;
    role: OrgRole;
  }
}

// Better SQLite3 types
declare module 'better-sqlite3' {
  type Database = {
    prepare: (sql: string) => Statement;
    exec: (sql: string) => Database;
    close: () => void;
    // Add other methods as needed
  };

  type Statement = {
    run: (...params: any[]) => RunResult;
    get: (...params: any[]) => any;
    all: (...params: any[]) => any[];
    // Add other methods as needed
  };

  type RunResult = {
    changes: number;
    lastInsertRowid: number | bigint;
  };

  type DatabaseConstructor = {
    new (filename: string, options?: any): Database;
    (filename: string, options?: any): Database;
  };

  const Database: DatabaseConstructor;
  export = Database;
}
