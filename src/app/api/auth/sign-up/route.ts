/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:00:20
 * Last Updated: 2025-12-23T21:00:20
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { auth } from '@/libs/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const { POST } = toNextJsHandler(auth);

export { POST };
