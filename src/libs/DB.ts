/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T20:30:21
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@/models/Schema';

// Create SQLite database instance
const sqlite = new Database('./sqlite.db');

// Create drizzle instance
export const db = drizzle(sqlite, { schema });

// Export the database instance
