/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T19:01:02
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

export const StickyBanner = (props: { children: React.ReactNode }) => (
  <div className="sticky top-0 z-50 bg-primary p-4 text-center text-lg font-semibold text-primary-foreground [&_a:hover]:text-indigo-500 [&_a]:text-fuchsia-500">
    {props.children}
  </div>
);
