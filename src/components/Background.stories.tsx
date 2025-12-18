/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-18T21:10:35
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { Meta, StoryObj } from '@storybook/react';

import { Background } from './Background';

const meta = {
  title: 'Components/Background',
  component: Background,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Background>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBackgroundWithChildren = {
  args: {
    children: <div>Children node</div>,
  },
} satisfies Story;

export const RedBackgroundWithChildren = {
  args: {
    className: 'bg-red-500',
    children: <div>Children node</div>,
  },
} satisfies Story;
