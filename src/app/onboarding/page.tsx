/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T16:18:31
 * Last Updated: 2025-12-24T16:18:31
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { redirect } from 'next/navigation';

export default function OnboardingRedirect() {
  redirect('/en/onboarding/organization-selection');
}
