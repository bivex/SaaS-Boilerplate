/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T17:23:05
 * Last Updated: 2025-12-23T19:01:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],

  // Custom parser preset for advanced formatting
  parserPreset: {
    parserOpts: {
      // Allow @scope references like @username
      issuePrefixes: ['#', '@'],
    },
  },

  rules: {
    // Type rules - enforce specific commit types
    'type-enum': [
      2,
      'always',
      [
        'build', // Changes that affect the build system or external dependencies
        'chore', // Other changes that don't modify src or test files
        'ci', // Changes to our CI configuration files and scripts
        'docs', // Documentation only changes
        'feat', // A new feature
        'fix', // A bug fix
        'perf', // A code change that improves performance
        'refactor', // A code change that neither fixes a bug nor adds a feature
        'revert', // Revert to a commit
        'style', // Changes that do not affect the meaning of the code (white-space, formatting, etc.)
        'test', // Adding missing tests or correcting existing tests
        'translation', // Changes related to translations
        'security', // Security fixes
        'breaking', // Breaking changes (alias for feat with BREAKING CHANGE)
      ],
    ],

    // Type case - enforce lowercase
    'type-case': [2, 'always', 'lower-case'],

    // Type empty - type cannot be empty
    'type-empty': [2, 'never'],

    // Type max length
    'type-max-length': [2, 'always', 12],

    // Scope rules
    'scope-case': [2, 'always', 'lower-case'],
    'scope-max-length': [2, 'always', 20],
    'scope-empty': [0, 'never'], // Allow empty scope

    // Subject rules - the main description
    'subject-case': [0, 'always', 'sentence-case'], // Allow sentence case (first letter can be upper or lower)
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'], // No period at end
    'subject-max-length': [2, 'always', 72], // Keep under 72 chars for git log readability

    // Header rules - type(scope): subject
    'header-max-length': [2, 'always', 100],

    // Body rules
    'body-leading-blank': [1, 'always'], // Blank line before body
    'body-max-line-length': [2, 'always', 100],
    'body-empty': [0, 'never'], // Allow empty body

    // Footer rules
    'footer-leading-blank': [1, 'always'], // Blank line before footer
    'footer-max-line-length': [2, 'always', 100],

    // References
    'references-empty': [0, 'never'], // Allow empty references
  },

  // Custom prompts for interactive commits
  prompt: {
    settings: {
      enableMultipleScopes: true,
      scopeEnumSeparator: ',',
    },
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit',
    },
    questions: {
      type: {
        description: 'Select the type of change that you\'re committing:',
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: 'Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: 'A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: 'Changes that affect the build system or external dependencies',
            title: 'Builds',
            emoji: '🛠️',
          },
          ci: {
            description: 'Changes to our CI configuration files and scripts',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: 'Other changes that don\'t modify src or test files',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '⏪',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      breaking: {
        description: 'Are there any breaking changes?',
      },
      footer: {
        description: 'Any issues this commit closes (e.g. #123)',
      },
    },
  },
};
