# Contributing to KushCloud

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs
1. Check existing [Issues](../../issues) to avoid duplicates
2. Use the bug report template
3. Include: steps to reproduce, expected vs actual behavior, environment details

### Suggesting Features
1. Open a [Feature Request](../../issues/new?template=feature_request.md)
2. Describe the use case, not just the solution

### Submitting Changes
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow the coding standards (see below)
4. Write/update tests for your changes
5. Ensure all tests pass: `npm test`
6. Ensure linting passes: `npm run lint`
7. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation
   - `refactor:` code restructuring
   - `test:` adding/updating tests
   - `chore:` maintenance
8. Push and open a Pull Request against `main`

### Pull Request Requirements
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Changelog entry added (if user-facing)
- [ ] At least 1 approving review

## Coding Standards
- Use TypeScript for all logic
- Use React for UI components
- Maximum line length: 100 characters
- Use meaningful variable/function names
- Comment complex logic

## Development Setup
```bash
# Clone the repository
git clone https://github.com/DLinacre/KushCloud.git
cd KushCloud

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

Questions?
Open a Discussion or reach out to the maintainers.
