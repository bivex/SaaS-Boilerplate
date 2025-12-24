/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T09:47:38
 * Last Updated: 2025-12-23T09:47:38
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  typescript: true,

  lessOpinionated: true,
  isInEditor: false,

  stylistic: {
    semi: true,
  },

  formatters: {
    css: true,
  },

  ignores: [
    'migrations/**/*',
    'next-env.d.ts',
    '**/*.test.*',
    '**/*.spec.*',
    'tests/**/*',
  ],

  rules: {
    'style/object-curly-spacing': ['error', 'always'], // Ensure consistent spacing within curly braces
    'style/brace-style': ['error', '1tbs'], // Use the default brace style
    'ts/consistent-type-definitions': ['error', 'type'], // Use `type` instead of `interface`
    'react/prefer-destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
    'react/no-children-map': 'off', // Acceptable for UI component libraries
    'react/no-clone-element': 'off', // Acceptable for UI component libraries
    'react/no-forward-ref': 'off', // Still needed for React Hook Form compatibility
    'node/prefer-global/process': 'off', // Allow using `process.env`
    'test/padding-around-all': 'error', // Add padding in test files
    'test/prefer-lowercase-title': 'off', // Allow using uppercase titles in test titles
  },
});
