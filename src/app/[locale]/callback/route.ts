/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T19:45:00
 * Last Updated: 2025-12-23T19:45:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { handleAuth } from '@workos-inc/authkit-nextjs';

// Redirect the user to `/` after successful sign in
// The redirect can be customized: `handleAuth({ returnPathname: '/dashboard' })`
export const GET = handleAuth({ returnPathname: '/dashboard' });
