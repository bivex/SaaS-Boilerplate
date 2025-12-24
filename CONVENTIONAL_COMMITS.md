# Conventional Commits

This project uses [Conventional Commits](https://conventionalcommits.org/) with advanced commitlint configuration for
all commit messages.

## Format

```
type(scope): description

[optional body]

[optional footer]
```

## Types

### Standard Types

- **build**: Changes that affect the build system or external dependencies 🛠️
- **chore**: Other changes that don't modify src or test files ♻️
- **ci**: Changes to our CI configuration files and scripts ⚙️
- **docs**: Documentation only changes 📚
- **feat**: A new feature ✨
- **fix**: A bug fix 🐛
- **perf**: A code change that improves performance 🚀
- **refactor**: A code change that neither fixes a bug nor adds a feature 📦
- **revert**: Revert to a commit ⏪
- **style**: Changes that do not affect the meaning of the code 💎
- **test**: Adding missing tests or correcting existing tests 🚨

### Custom Types (Project Specific)

- **translation**: Changes related to translations 🌍
- **security**: Security fixes 🔒
- **breaking**: Breaking changes ⚠️

## Rules

### Type Rules

- Type must be one of the allowed values
- Type must be in lowercase
- Maximum length: 12 characters

### Scope Rules (Optional)

- Scope must be in lowercase
- Maximum length: 20 characters
- Format: `component-name`, `file-name`, etc.

### Subject Rules

- First letter can be upper or lowercase (sentence case)
- No period at the end
- Maximum length: 72 characters
- Cannot be empty

### Header Rules

- Complete header (type + scope + subject) max 100 characters

### Body Rules (Optional)

- Must have blank line before body
- Max line length: 100 characters

### Footer Rules (Optional)

- Must have blank line before footer
- Max line length: 100 characters

## Examples

### ✅ Valid Commits

```
feat: add user authentication system
fix(auth): resolve login redirect issue
docs(api): update endpoint documentation
style: format code with prettier
refactor(db): simplify query optimization logic
test(utils): add unit tests for date helpers
chore: update dependencies to latest versions
perf(images): optimize image loading performance
security(auth): fix potential XSS vulnerability
breaking(api): remove deprecated endpoints
feat(ui,auth): add dark mode toggle component
```

### ❌ Invalid Commits

```
❌ wrong commit message
❌ fix bug in authentication
❌ FEAT: add new feature
❌ feat(auth): This is a very long subject that exceeds the maximum allowed length of seventy two characters for commit subjects
❌ feat: add feature.
```

## Validation

All commits are automatically validated using commitlint with husky hooks:

1. **pre-commit**: Runs lint-staged (ESLint auto-fix)
2. **commit-msg**: Validates commit message format

Invalid commit messages will be rejected with detailed error messages.

## Interactive Prompts

When using `git commit` without message, you'll get interactive prompts with:

- Type selection with descriptions and emojis
- Scope input
- Subject validation
- Body and footer options

## Benefits

- **Automatic changelog generation** with semantic-release
- **Semantic versioning** based on commit types
- **Better commit history** organization
- **Easier code review** with clear commit purposes
- **Automated validation** prevents inconsistent commit messages
- **Release automation** based on conventional commits
