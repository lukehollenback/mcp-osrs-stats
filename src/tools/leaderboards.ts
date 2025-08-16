import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OSRSService } from '../services/osrs-service.js';
import { 
  GetSkillLeaderboardSchema, 
  GetActivityLeaderboardSchema,
  VALID_SKILLS,
  VALID_ACTIVITIES,
  VALID_BOSSES,
  VALID_GAMEMODES
} from '../types/mcp-types.js';

export const getSkillLeaderboardTool: Tool = {
  name: 'get_skill_leaderboard',
  description: 'Get top players for a specific skill',
  inputSchema: {
    type: 'object',
    properties: {
      skill: {
        type: 'string',
        description: 'Skill name',
        enum: [...VALID_SKILLS]
      },
      gamemode: {
        type: 'string',
        description: 'Player game mode filter',
        enum: [...VALID_GAMEMODES],
        default: 'main'
      },
      page: {
        type: 'number',
        description: 'Page number (25 players per page)',
        minimum: 1,
        default: 1
      }
    },
    required: ['skill']
  }
};

export const getActivityLeaderboardTool: Tool = {
  name: 'get_activity_leaderboard',
  description: 'Get top players for activities (bosses, minigames, clues)',
  inputSchema: {
    type: 'object',
    properties: {
      activity: {
        type: 'string',
        description: 'Activity or boss name',
        enum: [...VALID_ACTIVITIES, ...VALID_BOSSES]
      },
      gamemode: {
        type: 'string',
        description: 'Player game mode filter',
        enum: [...VALID_GAMEMODES],
        default: 'main'
      },
      page: {
        type: 'number',
        description: 'Page number (25 players per page)',
        minimum: 1,
        default: 1
      }
    },
    required: ['activity']
  }
};

export async function handleGetSkillLeaderboard(
  args: unknown,
  osrsService: OSRSService
): Promise<any> {
  const params = GetSkillLeaderboardSchema.parse(args);
  
  const leaderboard = await osrsService.getSkillLeaderboard(
    params.skill,
    params.gamemode,
    params.page
  );
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(leaderboard, null, 2)
    }]
  };
}

export async function handleGetActivityLeaderboard(
  args: unknown,
  osrsService: OSRSService
): Promise<any> {
  const params = GetActivityLeaderboardSchema.parse(args);
  
  const leaderboard = await osrsService.getActivityLeaderboard(
    params.activity,
    params.gamemode,
    params.page
  );
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(leaderboard, null, 2)
    }]
  };
}