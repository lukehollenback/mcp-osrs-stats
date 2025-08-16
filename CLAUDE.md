# OSRS Player Stats MCP Server - Complete Technical Specification

## Project Definition
Model Context Protocol (MCP) server providing real-time Old School RuneScape player statistics and leaderboard data to AI assistants via stdio protocol.

## Architecture

### Technology Stack
- **Runtime**: Node.js 18+, TypeScript 5.0+
- **MCP Framework**: `@modelcontextprotocol/sdk` ^1.0.0
- **OSRS API**: `osrs-json-hiscores` ^2.23.0 (server-side only, CORS limitations)
- **Validation**: Zod ^3.22.0 with comprehensive schema validation
- **Testing**: Jest ^29.0.0 with ts-jest, 3-tier testing (unit/integration/E2E)
- **Distribution**: NPM package with auto-deployment via GitHub Actions

### Project Structure
```
mcp-osrs-stats/
├── src/
│   ├── index.ts              # MCP server entry point with stdio transport
│   ├── server.ts             # OSRSMCPServer class, tool registration, error handling
│   ├── tools/                # MCP tool implementations
│   │   ├── player-stats.ts   # handleGetPlayerStats + tool schema
│   │   ├── leaderboards.ts   # handleGetSkillLeaderboard + handleGetActivityLeaderboard
│   │   └── player-compare.ts # handleComparePlayers + tool schema  
│   ├── services/
│   │   └── osrs-service.ts   # OSRSService class wrapping osrs-json-hiscores API
│   ├── types/
│   │   ├── osrs-types.ts     # PlayerStats, LeaderboardResponse, OSRSError classes
│   │   └── mcp-types.ts      # Zod schemas + valid constants for skills/activities/bosses
│   └── utils/
│       ├── validation.ts     # Username/gamemode/skill validation functions
│       └── formatting.ts     # Data transformation utilities
├── tests/
│   ├── unit/                 # Schema validation, formatting utilities (28 tests)
│   ├── integration/          # Tool handlers with mocked OSRS API (20 tests)
│   └── e2e/                  # Full server via stdio protocol (7 tests)
├── DECISIONS.md              # Architecture decision log with impact analysis
├── CLAUDE.md                 # This complete technical specification
├── README.md                 # User-facing installation and usage documentation
└── .github/workflows/        # CI/CD: tests + auto NPM publish on version bump
```

## MCP Tools Implementation

### 1. `get_player_stats`
- **Handler**: `handleGetPlayerStats(args, osrsService)`
- **Schema**: `GetPlayerStatsSchema` validates username (1-12 chars) + optional gamemode
- **Service**: `osrsService.getPlayerStats()` calls `getStatsByGamemode()` 
- **Response**: Complete player object with skills/bosses/activities formatted via `formatPlayerStats()`

### 2. `get_skill_leaderboard` 
- **Handler**: `handleGetSkillLeaderboard(args, osrsService)`
- **Schema**: `GetSkillLeaderboardSchema` validates skill enum + optional gamemode/page
- **Service**: `osrsService.getSkillLeaderboard()` calls `getSkillPage()`
- **Response**: LeaderboardResponse with entries array (25 per page)

### 3. `get_activity_leaderboard`
- **Handler**: `handleGetActivityLeaderboard(args, osrsService)` 
- **Schema**: `GetActivityLeaderboardSchema` validates activity/boss enum + optional gamemode/page
- **Service**: `osrsService.getActivityLeaderboard()` calls `getActivityPage()`
- **Response**: LeaderboardResponse with score-based entries

### 4. `compare_players`
- **Handler**: `handleComparePlayers(args, osrsService)`
- **Schema**: `ComparePlayersSchema` validates 2-5 usernames + optional focus
- **Service**: `osrsService.comparePlayers()` fetches all players then builds comparison object
- **Response**: PlayerComparison with nested skill/boss/activity comparisons by username

## Critical Implementation Details

### Error Handling Strategy
- **Philosophy**: Surface OSRS API errors directly to AI clients (no rate limiting)
- **Validation**: Zod schemas throw with detailed error messages listing valid options
- **API Errors**: Wrapped in OSRSError class with code/message/details
- **MCP Protocol**: McpError thrown for unknown tools, validation failures become InvalidRequest

### Data Flow
1. **MCP Request** → Server validates via Zod schema → Tool handler → OSRSService method
2. **OSRS API Call** → Raw data transformation via formatting utils → Standardized response
3. **Response Format**: Always `{ content: [{ type: 'text', text: JSON.stringify(data) }] }`

### Testing Strategy  
- **Unit**: Schema validation, data formatting, basic utilities (no external deps)
- **Integration**: Tool handlers with mocked `osrs-json-hiscores` API calls
- **E2E**: Spawn real server process, communicate via stdio, test MCP protocol compliance

### Valid Data Constants
- **Skills**: 24 skills from 'overall' to 'construction' (exported in VALID_SKILLS)
- **Activities**: Clue scrolls, LMS, bounty hunter, soul wars (exported in VALID_ACTIVITIES)  
- **Bosses**: 45+ bosses from 'abyssal_sire' to 'zulrah' (exported in VALID_BOSSES)
- **Gamemodes**: main, ironman, hardcore_ironman, ultimate_ironman, deadman, seasonal

### Package Distribution
- **Name**: `mcp-osrs-stats`
- **Binary**: `dist/index.js` executable via `npx mcp-osrs-stats`
- **Auto-Deploy**: GitHub Action on main branch merges when package.json version incremented
- **Files**: Only `dist/`, `README.md`, `CLAUDE.md` included in NPM package

## Architecture Decisions

### Key Decision #1: Tool Set Simplification  
Removed `search_players` tool due to OSRS API limitations (exact username lookup only). Direct error surfacing instead of rate limiting complexity.

### Key Decision #2: OSRS API Integration
Use `getStatsByGamemode`, `getSkillPage`, `getActivityPage` functions with type assertions for library compatibility. Service layer provides defaults.

### Key Decision #3: Testing Strategy
Three-tier testing with mocked APIs for integration tests and real stdio protocol for E2E tests. Module resolution via custom Jest resolver.

### Key Decision #4: Comprehensive MCP Testing
Focus on actual MCP functionality testing rather than basic utilities. Tool handlers and stdio protocol compliance are critical.

## Development Commands
```bash
npm run build        # TypeScript compilation
npm run dev          # Development server with tsx
npm test             # All 55 tests
npm run test:unit    # Unit tests only
npm run test:integration  # Integration tests only  
npm run test:e2e     # End-to-end tests only
npm run test:coverage    # Coverage reporting
```

## Decision Log Management

### When to Log Decisions
Document any decision that:
- Changes the public API or tool interfaces
- Affects architecture or major code organization
- Chooses between significant alternatives (libraries, patterns, approaches)
- Impacts testing strategy or deployment process
- Resolves a design problem or technical constraint

### Decision Format
```markdown
## Decision #{number} - {YYYY-MM-DD} - {Title}

**Context**: Brief description of the situation requiring a decision

**Decision**: What was decided

**Rationale**: Why this decision was made

**Alternatives**: Other options considered

**Impact**: Expected consequences of this decision

---
```

### Decision Log Archiving
When `DECISIONS.md` reaches 250 entries:
1. Archive entries 1-200 to `DECISIONS-archive-{timestamp}.md`
2. Keep entries 201-250 in active log, renumber as 1-50
3. Add reference to archived file at top of active log

### Critical Decisions Already Logged
- Tool set simplification (removed search_players)
- OSRS API integration approach with type assertions
- Three-tier testing strategy with module resolution
- Comprehensive MCP server testing focus

## Regeneration Requirements
This specification contains all information needed to recreate the project:
- Complete architecture and file structure
- Implementation details for all MCP tools
- Testing strategy and organization  
- Error handling patterns
- Data validation and transformation logic
- Distribution and deployment setup
- Decision log management process