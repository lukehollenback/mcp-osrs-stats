# Contributing to OSRS Player Stats MCP Server

Thank you for your interest in contributing to this project! This document outlines the coding standards and development workflow.

## Development Setup

1. **Prerequisites**
   - Node.js 18+ (we test on 18.x, 20.x, and 22.x)
   - npm (comes with Node.js)

2. **Installation**
   ```bash
   git clone https://github.com/lukehollenback/mcp-osrs-stats.git
   cd mcp-osrs-stats
   npm install
   npm run prepare  # Sets up git hooks
   ```

3. **Development Commands**
   ```bash
   npm run dev          # Start development server
   npm run build        # Build for production
   npm run type-check   # TypeScript compilation check
   npm run lint         # Run ESLint
   npm run lint:fix     # Auto-fix ESLint issues
   npm run format       # Format code with Prettier
   npm run format:check # Check formatting without changing files
   npm test             # Run all tests
   npm run test:unit    # Run unit tests only
   npm run test:integration  # Run integration tests only
   npm run test:e2e     # Run end-to-end tests only
   npm run test:coverage     # Run tests with coverage report
   ```

## Coding Standards

### Code Style
- **Language**: TypeScript with strict mode enabled
- **Formatting**: Prettier with single quotes, 100 character line length
- **Linting**: ESLint with TypeScript-specific rules
- **Editor**: EditorConfig for consistent formatting across editors

### Code Quality Requirements
- All functions must have explicit return types
- No `any` types allowed
- Strict TypeScript compiler settings
- Comprehensive error handling
- Runtime validation with Zod schemas

### File Organization
```
src/
├── index.ts              # Entry point
├── server.ts             # Main server class
├── tools/                # MCP tool implementations
├── services/             # External API services
├── types/                # Type definitions and schemas
└── utils/                # Utility functions

tests/
├── unit/                 # Unit tests (no external dependencies)
├── integration/          # Integration tests (mocked dependencies)
└── e2e/                  # End-to-end tests (full protocol)
```

### Testing Standards
- **Coverage**: Maintain high test coverage (aim for >90%)
- **Test Types**: 
  - Unit tests for utilities and schemas
  - Integration tests for tool handlers
  - E2E tests for MCP protocol compliance
- **Test Organization**: Mirror source structure in test directories
- **Mocking**: Use mocks for external dependencies in integration tests

### Git Workflow

1. **Branch Naming**: Use descriptive names (e.g., `feature/new-tool`, `fix/validation-bug`)

2. **Commits**: 
   - Use conventional commit messages
   - Keep commits focused and atomic
   - All commits must pass pre-commit hooks

3. **Pre-commit Checks**: (automatically enforced)
   - ESLint passes with no errors
   - Code is properly formatted with Prettier
   - TypeScript compilation succeeds
   - All tests pass

4. **Pull Requests**:
   - Reference related issues
   - Include clear description of changes
   - Ensure CI passes on all Node.js versions
   - Update documentation if needed

### Documentation Standards

1. **Code Documentation**
   - Use JSDoc comments for public APIs
   - Include parameter and return type descriptions
   - Document complex business logic

2. **File Documentation**
   - `CLAUDE.md`: Complete technical specification
   - `README.md`: User-facing documentation
   - `DECISIONS.md`: Architecture decision log
   - `CONTRIBUTING.md`: This file

3. **API Documentation**
   - Tool schemas are self-documenting via Zod
   - Keep README.md examples up to date

### Error Handling

- Use custom error classes (e.g., `OSRSError`)
- Provide meaningful error messages
- Include validation error details
- Follow MCP protocol error conventions

### Performance Considerations

- Minimize API calls to OSRS endpoints
- Use efficient data structures
- Cache responses where appropriate
- Optimize for low memory usage

## Architecture Decisions

Before making significant changes:

1. Review `DECISIONS.md` for context
2. Consider impact on existing patterns
3. Document new decisions following the established format
4. Discuss major changes in issues before implementation

## Security Guidelines

- Never expose API keys or secrets
- Validate all user inputs
- Use secure dependencies
- Follow principle of least privilege

## Getting Help

- Check existing issues and documentation first
- Create detailed issue reports with reproduction steps
- Reference specific code sections when reporting bugs
- Include environment details (Node.js version, OS, etc.)

## Code Review Process

All changes require:
- Passing CI checks
- Code review from maintainers
- Updated tests for new functionality
- Documentation updates for user-facing changes

Thank you for contributing to make this project better!