# Architecture Decisions Log

This document tracks all significant design and implementation decisions for the OSRS Player Stats MCP Server.

## Decision #1 - 2025-08-16 - Tool Set Simplification and Error Handling Strategy

**Context**: Initial architecture review revealed limitations with the OSRS hiscores API that don't support player search functionality, and considerations around rate limiting and error handling approaches.

**Decision**: 
1. Remove the `search_players` tool entirely due to API limitations
2. Implement simplified error handling that surfaces API errors directly to the AI client
3. Focus on 4 core tools: get_player_stats, get_skill_leaderboard, get_activity_leaderboard, and compare_players
4. No rate limiting implementation - let the API handle its own limits

**Rationale**: 
- The OSRS hiscores API only supports exact username lookups, making player search impossible
- Simplified error handling reduces complexity while still providing meaningful feedback
- Direct error surfacing allows AI clients to handle and communicate issues appropriately
- Focusing on core functionality ensures robust implementation of essential features

**Alternatives**: 
- Could have implemented a mock search using cached player data
- Could have added complex rate limiting with queuing and backoff strategies
- Could have transformed API errors into generic error messages

**Impact**: 
- Simplified codebase with fewer tools to maintain
- Faster development cycle focusing on core functionality
- More transparent error handling for AI clients
- Reduced infrastructure complexity

---

## Decision #2 - 2025-08-16 - OSRS API Integration and Library Usage

**Context**: Implementation phase revealed specific API patterns and library usage requirements for the osrs-json-hiscores library that differ from initial assumptions.

**Decision**: 
1. Use `getStatsByGamemode()` for player stats instead of generic `getStats()`
2. Import specific functions (`getStatsByGamemode`, `getSkillPage`, `getActivityPage`) rather than a class
3. Use type assertions (`as any`) for gamemode and skill/activity parameters to handle library type mismatches
4. Map library's data structure to our standardized response format via formatting utilities

**Rationale**: 
- The osrs-json-hiscores library uses static functions rather than class instances
- Library types are more restrictive than our schema allows, requiring type assertions
- Direct API mapping ensures we get the exact data we need for each use case
- Formatting layer abstracts library-specific data structures from our API consumers

**Alternatives**: 
- Could have created wrapper classes around library functions
- Could have modified our types to exactly match library types
- Could have used different OSRS data sources

**Impact**: 
- Clean separation between external API and our MCP interface
- Flexibility to modify data formatting without changing tool contracts
- Potential type safety reduction due to assertions, but acceptable for MVP
- Simplified service layer with direct function calls

---

## Decision #3 - 2025-08-16 - Testing Strategy and Module Resolution

**Context**: Implementation of comprehensive testing suite revealed module resolution challenges with ESM imports and Jest configuration in a TypeScript project using .js extensions for runtime compatibility.

**Decision**: 
1. Implement unit tests for core utility functions and schema validation
2. Use Jest with ts-jest preset for TypeScript testing
3. Focus on unit testing rather than complex integration tests initially  
4. Add GitHub Actions CI/CD pipeline with automated testing
5. Include test coverage reporting and status badges

**Rationale**: 
- Unit tests provide excellent coverage for critical validation and formatting logic
- Module resolution issues with .js extensions in TypeScript can be complex to solve
- Focus on testable core logic rather than integration complexity for MVP
- CI/CD pipeline ensures quality and provides confidence for contributions
- Test coverage metrics help maintain code quality standards

**Alternatives**: 
- Could have solved ESM module resolution for full integration testing
- Could have used different testing framework (Vitest, Mocha, etc.)
- Could have converted entire codebase to use .ts extensions only

**Impact**: 
- Solid foundation for code quality with 100% statement coverage on tested modules
- Automated quality gates via GitHub Actions
- Clear testing patterns for future development
- Some integration scenarios require manual testing initially

---

## Decision #4 - 2025-08-16 - Comprehensive MCP Server Testing Strategy

**Context**: After implementing basic tests, realized the critical need to actually test MCP server functionality rather than just utility functions. The server's core purpose is handling MCP protocol requests.

**Decision**: 
1. Implement integration tests that directly test tool handler functions with mocked OSRS API
2. Create end-to-end tests that spawn the actual server process and communicate via stdio
3. Organize tests into three tiers: unit, integration, and E2E
4. Add separate npm scripts for each test type
5. Update CI pipeline to run all test types systematically

**Rationale**: 
- Tool handler integration tests verify the actual MCP request/response flow
- E2E tests via stdio ensure the server protocol implementation works correctly
- Three-tier testing provides comprehensive coverage from unit to system level
- Mocked API calls allow reliable testing without external dependencies
- Real server startup in E2E tests catches configuration and runtime issues

**Alternatives**: 
- Could have used real OSRS API calls (unreliable, slow, external dependency)
- Could have tested only at unit level (misses critical integration bugs)
- Could have used HTTP-based testing instead of stdio (not the actual interface)

**Impact**: 
- Full test coverage of MCP server functionality (64 tests total)
- Reliable CI/CD pipeline that catches MCP protocol issues
- Clear separation of concerns in test organization
- Fast feedback cycle with quick unit tests and thorough integration/E2E coverage
- High confidence in server deployment and functionality

---

## Decision #5 - 2025-08-16 - Documentation Architecture Consolidation

**Context**: Initial documentation structure created redundancy across CLAUDE.md, README.md, and docs/specification.md with overlapping information that would be difficult to keep in sync. Need single source of truth for each type of information.

**Decision**: 
1. Make CLAUDE.md the master technical specification and AI regeneration source
2. Make README.md purely user-facing documentation (installation, usage, examples)
3. Remove docs/specification.md (redundant with CLAUDE.md)
4. Move docs/decisions.md to root as DECISIONS.md for better visibility
5. Delete docs/ directory entirely
6. Add decision log management guidance to CLAUDE.md

**Rationale**: 
- Zero redundancy prevents documentation drift and maintenance burden
- Clear separation: technical specs vs user guides
- CLAUDE.md contains everything needed for AI to regenerate the project
- Root-level DECISIONS.md is more discoverable
- Single authoritative location for each piece of information

**Alternatives**: 
- Could have kept all three files with careful coordination
- Could have moved everything into README.md (but would be too long)
- Could have kept docs/ directory structure

**Impact**: 
- Eliminates information redundancy and sync issues
- Clear documentation boundaries and purposes
- Improved maintainability and contributor experience
- AI agents can find exactly what they need without confusion
- Complete project regeneration capability from CLAUDE.md alone

---