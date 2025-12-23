/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T17:07:04
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

export const PricingFeature = (props: { children: React.ReactNode }) => (
  <li className="flex items-center text-muted-foreground">
    <svg
      className="mr-1 size-6 stroke-current stroke-2 text-purple-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M5 12l5 5L20 7" />
    </svg>
    {props.children}
  </li>
);
