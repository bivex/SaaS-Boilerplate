/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T06:30:00
 * Last Updated: 2025-12-24T06:30:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

'use client';

import dynamic from 'next/dynamic';

// Lazy load UIComponents only when user scrolls near it - client component for ssr: false
const UIComponents = dynamic(() => import('@/templates/UIComponents').then(mod => ({ default: mod.UIComponents })), {
  loading: () => <div className="h-96 bg-muted animate-pulse" />,
  ssr: false, // Disable SSR for this heavy component
});

export const UIComponentsWrapper = () => {
  return <UIComponents />;
};
