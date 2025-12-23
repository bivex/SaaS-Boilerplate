/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-23T17:24:48
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

export const DashboardSection = (props: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-md bg-card p-5">
    <div className="max-w-3xl">
      <div className="text-lg font-semibold">{props.title}</div>

      <div className="mb-4 text-sm font-medium text-muted-foreground">
        {props.description}
      </div>

      {props.children}
    </div>
  </div>
);
