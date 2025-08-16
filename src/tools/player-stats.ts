import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { OSRSService } from '../services/osrs-service.js';
import { GetPlayerStatsSchema } from '../types/mcp-types.js';

export const getPlayerStatsTool: Tool = {
  name: 'get_player_stats',
  description: 'Retrieve comprehensive statistics for a specific OSRS player including skills, activities, and boss kill counts',
  inputSchema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        description: 'OSRS player username (1-12 characters)',
        minLength: 1,
        maxLength: 12
      },
      gamemode: {
        type: 'string',
        description: 'Player game mode',
        enum: ['main', 'ironman', 'hardcore_ironman', 'ultimate_ironman', 'deadman', 'seasonal'],
        default: 'main'
      }
    },
    required: ['username']
  }
};

export async function handleGetPlayerStats(
  args: unknown,
  osrsService: OSRSService
): Promise<any> {
  const params = GetPlayerStatsSchema.parse(args);
  
  const playerStats = await osrsService.getPlayerStats(
    params.username,
    params.gamemode
  );
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(playerStats, null, 2)
    }]
  };
}