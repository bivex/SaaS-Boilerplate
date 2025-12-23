/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T20:00:00
 * Last Updated: 2025-12-23T20:00:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { handleAuth } from '@workos-inc/authkit-nextjs';

// Handle WorkOS authentication callback
// This route handles the callback from WorkOS after user authentication
// Redirect the user to the dashboard after successful sign in
export const GET = handleAuth({ returnPathname: '/dashboard' });
