# OSRS Player Stats MCP Server

[![CI](https://github.com/lukehollenback/mcp-osrs-stats/workflows/CI/badge.svg)](https://github.com/lukehollenback/mcp-osrs-stats/actions)
[![codecov](https://codecov.io/gh/lukehollenback/mcp-osrs-stats/graph/badge.svg)](https://codecov.io/gh/lukehollenback/mcp-osrs-stats)
[![npm version](https://badge.fury.io/js/mcp-osrs-stats.svg)](https://badge.fury.io/js/mcp-osrs-stats)

A Model Context Protocol (MCP) server that provides real-time Old School RuneScape (OSRS) player statistics and leaderboard data to AI assistants.

## Features

- **Player Statistics**: Get comprehensive stats for any OSRS player including skills, activities, and boss kill counts
- **Skill Leaderboards**: View top players for any skill across different game modes
- **Activity/Boss Leaderboards**: Check rankings for activities, minigames, and boss encounters
- **Player Comparison**: Compare multiple players' statistics side-by-side
- **Multiple Game Modes**: Support for main, ironman, hardcore ironman, ultimate ironman, deadman, and seasonal modes

## Installation

### Via npx (Recommended)
```bash
npx mcp-osrs-stats
```

### Via npm
```bash
npm install -g mcp-osrs-stats
mcp-osrs-stats
```

## Claude Desktop Configuration

Add this to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "osrs-player-stats": {
      "command": "npx",
      "args": ["-y", "mcp-osrs-stats"]
    }
  }
}
```

## Available Tools

### 1. `get_player_stats`
Retrieve comprehensive statistics for a specific OSRS player.

**Parameters:**
- `username` (required): OSRS player username (1-12 characters)
- `gamemode` (optional): Player game mode (default: "main")

**Example:**
```json
{
  "username": "Zezima",
  "gamemode": "main"
}
```

### 2. `get_skill_leaderboard`
Get top players for a specific skill.

**Parameters:**
- `skill` (required): Skill name (e.g., "attack", "woodcutting", "overall")
- `gamemode` (optional): Player game mode filter (default: "main")
- `page` (optional): Page number (default: 1, 25 players per page)

**Valid Skills:**
overall, attack, defence, strength, hitpoints, ranged, prayer, magic, cooking, woodcutting, fletching, fishing, firemaking, crafting, smithing, mining, herblore, agility, thieving, slayer, farming, runecrafting, hunter, construction

### 3. `get_activity_leaderboard`
Get top players for activities (bosses, minigames, clues).

**Parameters:**
- `activity` (required): Activity or boss name
- `gamemode` (optional): Player game mode filter (default: "main")
- `page` (optional): Page number (default: 1, 25 players per page)

**Valid Activities:**
- Clue Scrolls: clue_scrolls_all, clue_scrolls_beginner, clue_scrolls_easy, etc.
- Bosses: zulrah, vorkath, chambers_of_xeric, theatre_of_blood, etc.
- Other: lms_rank, bounty_hunter_hunter, soul_wars_zeal, etc.

### 4. `compare_players`
Compare statistics between multiple OSRS players.

**Parameters:**
- `usernames` (required): Array of 2-5 player usernames
- `focus` (optional): Comparison focus ("skills", "bosses", "activities", or "all")

**Example:**
```json
{
  "usernames": ["Player1", "Player2", "Player3"],
  "focus": "skills"
}
```

## Game Modes

- `main`: Regular accounts
- `ironman`: Ironman accounts
- `hardcore_ironman`: Hardcore ironman accounts
- `ultimate_ironman`: Ultimate ironman accounts
- `deadman`: Deadman mode accounts
- `seasonal`: Seasonal/League accounts

## Error Handling

The server provides detailed error messages for common issues:
- Invalid usernames (wrong format, too long, etc.)
- Invalid skill/activity names
- Player not found
- API connectivity issues

All errors include helpful information to guide correct usage.

## Technical Details

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **API**: Uses `osrs-json-hiscores` library for OSRS data
- **Protocol**: Model Context Protocol (MCP)
- **Validation**: Zod schema validation for all inputs

## Contributing

1. Review `CLAUDE.md` for complete technical specification and development patterns
2. Check `DECISIONS.md` for architectural context and decision history
3. Follow existing code patterns and ensure all changes are properly typed and validated
4. Run the full test suite before submitting PRs

## License

MIT

## Support

For issues and feature requests, please check the project's issue tracker.