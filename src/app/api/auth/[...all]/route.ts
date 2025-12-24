/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T22:25:00
 * Last Updated: 2025-12-24T01:50:51
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/libs/auth';

console.warn('🔧 Setting up Better Auth routes...');

export const { GET, POST } = toNextJsHandler(auth);

console.warn('✅ Better Auth routes configured');
