import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { OSRSService } from './services/osrs-service.js';
import { OSRSError } from './types/osrs-types.js';

// Tool imports
import { getPlayerStatsTool, handleGetPlayerStats } from './tools/player-stats.js';
import { 
  getSkillLeaderboardTool, 
  getActivityLeaderboardTool,
  handleGetSkillLeaderboard,
  handleGetActivityLeaderboard 
} from './tools/leaderboards.js';
import { comparePlayersTool, handleComparePlayers } from './tools/player-compare.js';

export class OSRSMCPServer {
  private server: Server;
  private osrsService: OSRSService;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-osrs-stats',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    this.osrsService = new OSRSService();
    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          getPlayerStatsTool,
          getSkillLeaderboardTool,
          getActivityLeaderboardTool,
          comparePlayersTool,
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'get_player_stats':
            return await handleGetPlayerStats(request.params.arguments, this.osrsService);
          
          case 'get_skill_leaderboard':
            return await handleGetSkillLeaderboard(request.params.arguments, this.osrsService);
          
          case 'get_activity_leaderboard':
            return await handleGetActivityLeaderboard(request.params.arguments, this.osrsService);
          
          case 'compare_players':
            return await handleComparePlayers(request.params.arguments, this.osrsService);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof OSRSError) {
          throw new McpError(ErrorCode.InvalidRequest, error.message);
        }
        
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    
    // Handle process termination gracefully
    process.on('SIGINT', () => {
      console.error('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.error('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
    
    // Handle uncaught errors to prevent hanging
    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
    
    try {
      await this.server.connect(transport);
      console.error('OSRS Player Stats MCP server running on stdio');
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}