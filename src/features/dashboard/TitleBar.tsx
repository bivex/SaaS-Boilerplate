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

export const TitleBar = (props: {
  title: React.ReactNode;
  description?: React.ReactNode;
}) => (
  <div className="mb-8">
    <div className="text-2xl font-semibold">{props.title}</div>

    {props.description && (
      <div className="text-sm font-medium text-muted-foreground">
        {props.description}
      </div>
    )}
  </div>
);
