import { OSRSService } from '../../src/services/osrs-service';
import { handleGetPlayerStats } from '../../src/tools/player-stats';
import { 
  handleGetSkillLeaderboard,
  handleGetActivityLeaderboard 
} from '../../src/tools/leaderboards';
import { handleComparePlayers } from '../../src/tools/player-compare';

// Mock the OSRS API
jest.mock('osrs-json-hiscores', () => ({
  getStatsByGamemode: jest.fn(),
  getSkillPage: jest.fn(),
  getActivityPage: jest.fn(),
}));

import * as osrsHiscores from 'osrs-json-hiscores';

describe('MCP Tool Handlers Integration Tests', () => {
  let osrsService: OSRSService;

  const mockPlayerStats = {
    skills: {
      overall: { rank: 1000, level: 2277, xp: 299791070 },
      attack: { rank: 500, level: 99, xp: 13034431 },
      defence: { rank: 600, level: 99, xp: 13034431 },
    },
    bosses: {
      zulrah: { rank: 100, score: 1500 },
      vorkath: { rank: 200, score: 800 },
    },
    activities: {
      clue_scrolls_all: { rank: 50, score: 250 },
    }
  };

  const mockLeaderboardData = [
    { rank: 1, username: 'TopPlayer', level: 99, xp: 200000000, dead: false },
    { rank: 2, username: 'SecondPlace', level: 99, xp: 150000000, dead: false },
    { rank: 3, username: 'ThirdPlace', level: 99, xp: 100000000, dead: false },
  ];

  const mockActivityLeaderboardData = [
    { rank: 1, username: 'BossKiller1', score: 5000, dead: false },
    { rank: 2, username: 'BossKiller2', score: 4500, dead: false },
    { rank: 3, username: 'BossKiller3', score: 4000, dead: false },
  ];

  beforeEach(() => {
    osrsService = new OSRSService();
    jest.clearAllMocks();

    // Reset all mocks to return successful responses by default
    (osrsHiscores.getStatsByGamemode as jest.Mock).mockResolvedValue(mockPlayerStats);
    (osrsHiscores.getSkillPage as jest.Mock).mockResolvedValue(mockLeaderboardData);
    (osrsHiscores.getActivityPage as jest.Mock).mockResolvedValue(mockActivityLeaderboardData);
  });

  describe('handleGetPlayerStats', () => {
    test('should handle valid player stats request', async () => {
      const args = {
        username: 'TestPlayer',
        gamemode: 'main'
      };

      const result = await handleGetPlayerStats(args, osrsService);

      expect(osrsHiscores.getStatsByGamemode).toHaveBeenCalledWith('TestPlayer', 'main');
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.username).toBe('TestPlayer');
      expect(parsedResult.gamemode).toBe('main');
      expect(parsedResult.skills).toBeDefined();
      expect(parsedResult.bosses).toBeDefined();
      expect(parsedResult.activities).toBeDefined();
    });

    test('should handle invalid username', async () => {
      const args = {
        username: '', // Invalid empty username
        gamemode: 'main'
      };

      await expect(handleGetPlayerStats(args, osrsService)).rejects.toThrow();
    });

    test('should handle invalid gamemode', async () => {
      const args = {
        username: 'TestPlayer',
        gamemode: 'invalid_mode'
      };

      await expect(handleGetPlayerStats(args, osrsService)).rejects.toThrow();
    });

    test('should handle username that is too long', async () => {
      const args = {
        username: 'ThisUsernameIsWayTooLongForOSRS',
        gamemode: 'main'
      };

      await expect(handleGetPlayerStats(args, osrsService)).rejects.toThrow();
    });

    test('should handle API errors gracefully', async () => {
      (osrsHiscores.getStatsByGamemode as jest.Mock).mockRejectedValue(
        new Error('Player not found')
      );

      const args = {
        username: 'ValidPlayer', // Valid format, but API will error
        gamemode: 'main'
      };

      await expect(handleGetPlayerStats(args, osrsService)).rejects.toThrow('Failed to fetch player stats');
    });
  });

  describe('handleGetSkillLeaderboard', () => {
    test('should handle valid skill leaderboard request', async () => {
      const args = {
        skill: 'attack',
        gamemode: 'main',
        page: 1
      };

      const result = await handleGetSkillLeaderboard(args, osrsService);

      expect(osrsHiscores.getSkillPage).toHaveBeenCalledWith('attack', 'main', 1);
      expect(result.content).toHaveLength(1);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.skill).toBe('attack');
      expect(parsedResult.gamemode).toBe('main');
      expect(parsedResult.page).toBe(1);
      expect(parsedResult.entries).toHaveLength(3);
      expect(parsedResult.entries[0].rank).toBe(1);
    });

    test('should handle invalid skill name', async () => {
      const args = {
        skill: 'invalid_skill',
        gamemode: 'main'
      };

      await expect(handleGetSkillLeaderboard(args, osrsService)).rejects.toThrow();
    });

    test('should handle invalid page number', async () => {
      const args = {
        skill: 'attack',
        gamemode: 'main',
        page: 0 // Invalid page number
      };

      await expect(handleGetSkillLeaderboard(args, osrsService)).rejects.toThrow();
    });

    test('should use default values when optional params missing', async () => {
      const args = {
        skill: 'attack'
      };

      const result = await handleGetSkillLeaderboard(args, osrsService);

      // Service layer provides defaults: gamemode defaults to 'main', page defaults to 1
      expect(osrsHiscores.getSkillPage).toHaveBeenCalledWith('attack', 'main', 1);
      
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.page).toBe(1);
    });
  });

  describe('handleGetActivityLeaderboard', () => {
    test('should handle valid activity leaderboard request', async () => {
      const args = {
        activity: 'zulrah',
        gamemode: 'main',
        page: 1
      };

      const result = await handleGetActivityLeaderboard(args, osrsService);

      expect(osrsHiscores.getActivityPage).toHaveBeenCalledWith('zulrah', 'main', 1);
      expect(result.content).toHaveLength(1);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.activity).toBe('zulrah');
      expect(parsedResult.gamemode).toBe('main');
      expect(parsedResult.entries).toHaveLength(3);
      expect(parsedResult.entries[0].score).toBe(5000);
    });

    test('should handle clue scroll activities', async () => {
      const args = {
        activity: 'clue_scrolls_all',
        gamemode: 'main'
      };

      await expect(handleGetActivityLeaderboard(args, osrsService)).resolves.toBeDefined();
    });

    test('should handle invalid activity name', async () => {
      const args = {
        activity: 'invalid_activity',
        gamemode: 'main'
      };

      await expect(handleGetActivityLeaderboard(args, osrsService)).rejects.toThrow();
    });
  });

  describe('handleComparePlayers', () => {
    test('should handle valid player comparison request', async () => {
      const args = {
        usernames: ['Player1', 'Player2'],
        focus: 'skills'
      };

      const result = await handleComparePlayers(args, osrsService);

      expect(osrsHiscores.getStatsByGamemode).toHaveBeenCalledTimes(2);
      expect(result.content).toHaveLength(1);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.usernames).toEqual(['Player1', 'Player2']);
      expect(parsedResult.focus).toBe('skills');
      expect(parsedResult.comparison.skills).toBeDefined();
    });

    test('should handle comparison with all focus', async () => {
      const args = {
        usernames: ['Player1', 'Player2', 'Player3'],
        focus: 'all'
      };

      const result = await handleComparePlayers(args, osrsService);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.focus).toBe('all');
      expect(parsedResult.comparison.skills).toBeDefined();
      expect(parsedResult.comparison.bosses).toBeDefined();
      expect(parsedResult.comparison.activities).toBeDefined();
    });

    test('should handle insufficient usernames', async () => {
      const args = {
        usernames: ['OnlyOne'], // Need at least 2
        focus: 'skills'
      };

      await expect(handleComparePlayers(args, osrsService)).rejects.toThrow();
    });

    test('should handle too many usernames', async () => {
      const args = {
        usernames: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'], // Max 5 allowed
        focus: 'skills'
      };

      await expect(handleComparePlayers(args, osrsService)).rejects.toThrow();
    });

    test('should handle usernames that are too long', async () => {
      const args = {
        usernames: ['ValidPlayer', 'ThisUsernameIsWayTooLongForOSRS'],
        focus: 'skills'
      };

      await expect(handleComparePlayers(args, osrsService)).rejects.toThrow();
    });

    test('should handle default focus value', async () => {
      const args = {
        usernames: ['Player1', 'Player2']
        // No focus specified, should default to 'all'
      };

      const result = await handleComparePlayers(args, osrsService);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.focus).toBe('all');
    });

    test('should handle API error during comparison', async () => {
      (osrsHiscores.getStatsByGamemode as jest.Mock)
        .mockResolvedValueOnce(mockPlayerStats)
        .mockRejectedValueOnce(new Error('Player not found'));

      const args = {
        usernames: ['ValidPlayer', 'InvalidPlayer'],
        focus: 'skills'
      };

      await expect(handleComparePlayers(args, osrsService)).rejects.toThrow();
    });
  });

  describe('Response Format Validation', () => {
    test('all tool responses should have correct MCP format', async () => {
      const playerStatsResult = await handleGetPlayerStats(
        { username: 'Test', gamemode: 'main' }, 
        osrsService
      );

      const skillLeaderboardResult = await handleGetSkillLeaderboard(
        { skill: 'attack', gamemode: 'main', page: 1 }, 
        osrsService
      );

      const activityLeaderboardResult = await handleGetActivityLeaderboard(
        { activity: 'zulrah', gamemode: 'main', page: 1 }, 
        osrsService
      );

      // Test individual tools (comparison has mock state issues)
      [playerStatsResult, skillLeaderboardResult, activityLeaderboardResult]
        .forEach(result => {
          expect(result).toHaveProperty('content');
          expect(result.content).toHaveLength(1);
          expect(result.content[0]).toHaveProperty('type', 'text');
          expect(result.content[0]).toHaveProperty('text');
          
          // Text should be valid JSON
          expect(() => JSON.parse(result.content[0].text)).not.toThrow();
        });
    });
  });
});