# Conventional Commits

This project uses [Conventional Commits](https://conventionalcommits.org/) for all commit messages.

## Format

```
type(scope): description

[optional body]

[optional footer]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

## Examples

```
feat: add user authentication
fix: resolve memory leak in data processing
docs: update API documentation
style: format code with prettier
refactor: simplify user validation logic
test: add unit tests for payment service
chore: update dependencies
```

## Validation

All commits are automatically validated using commitlint. Invalid commit messages will be rejected.

## Benefits

- Automatic changelog generation
- Semantic versioning
- Better commit history organization
- Easier code review and release management
