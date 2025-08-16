import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OSRSService } from '../services/osrs-service.js';
import { ComparePlayersSchema } from '../types/mcp-types.js';

export const comparePlayersTool: Tool = {
  name: 'compare_players',
  description: 'Compare statistics between multiple OSRS players',
  inputSchema: {
    type: 'object',
    properties: {
      usernames: {
        type: 'array',
        description: 'List of 2-5 player usernames to compare',
        items: {
          type: 'string',
          minLength: 1,
          maxLength: 12
        },
        minItems: 2,
        maxItems: 5
      },
      focus: {
        type: 'string',
        description: 'Comparison focus area',
        enum: ['skills', 'bosses', 'activities', 'all'],
        default: 'all'
      }
    },
    required: ['usernames']
  }
};

export async function handleComparePlayers(
  args: unknown,
  osrsService: OSRSService
): Promise<any> {
  const params = ComparePlayersSchema.parse(args);
  
  const comparison = await osrsService.comparePlayers(
    params.usernames,
    params.focus
  );
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(comparison, null, 2)
    }]
  };
}