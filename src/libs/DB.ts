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

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { PgliteDatabase } from 'drizzle-orm/pglite';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Client } from 'pg';

import * as schema from '@/models/Schema';

import { Env } from './Env';

let dbInstance: NodePgDatabase<typeof schema> | PgliteDatabase<typeof schema> | undefined;

async function initializeDb() {
  // Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
  // Tested and compatible with Next.js Boilerplate
  if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD && Env.DATABASE_URL) {
    const client = new Client({
      connectionString: Env.DATABASE_URL,
    });
    await client.connect();

    const drizzle = drizzlePg(client, { schema });
    await migratePg(drizzle, {
      migrationsFolder: path.join(process.cwd(), 'migrations'),
    });
    dbInstance = drizzle;
  } else {
    // Stores the db connection in the global scope to prevent multiple instances due to hot reloading with Next.js
    const global = globalThis as unknown as { client: PGlite; drizzle: PgliteDatabase<typeof schema> };

    if (!global.client) {
      global.client = new PGlite();
      await global.client.waitReady;

      global.drizzle = drizzlePglite(global.client, { schema });
    }

    const drizzle = global.drizzle;
    await migratePglite(drizzle, {
      migrationsFolder: path.join(process.cwd(), 'migrations'),
    });
    dbInstance = drizzle;
  }
}

(async () => {
  await initializeDb();
})();

export const db = dbInstance!;
