/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-24T01:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import React from 'react';

export const MessageState = (props: {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  button: React.ReactNode;
}) => (
  <div className="flex h-[600px] flex-col items-center justify-center rounded-md bg-card p-5">
    <div className="size-16 rounded-full bg-muted p-3 [&_svg]:stroke-muted-foreground [&_svg]:stroke-2">
      {props.icon}
    </div>

    <div className="mt-3 text-center">
      <div className="text-xl font-semibold">{props.title}</div>
      <div className="mt-1 text-sm font-medium text-muted-foreground">
        {props.description}
      </div>

      <div className="mt-5">{props.button}</div>
    </div>
  </div>
);
