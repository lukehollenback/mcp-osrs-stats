import { 
  GetPlayerStatsSchema, 
  GetSkillLeaderboardSchema, 
  GetActivityLeaderboardSchema, 
  ComparePlayersSchema 
} from '../../src/types/mcp-types';

describe('MCP Schemas', () => {
  describe('GetPlayerStatsSchema', () => {
    test('should validate correct player stats params', () => {
      const validParams = { username: 'TestPlayer', gamemode: 'main' };
      expect(() => GetPlayerStatsSchema.parse(validParams)).not.toThrow();
    });

    test('should validate without gamemode', () => {
      const validParams = { username: 'TestPlayer' };
      expect(() => GetPlayerStatsSchema.parse(validParams)).not.toThrow();
    });

    test('should reject invalid usernames', () => {
      expect(() => GetPlayerStatsSchema.parse({ username: '' })).toThrow();
      expect(() => GetPlayerStatsSchema.parse({ username: 'ThisUsernameIsTooLong' })).toThrow();
    });

    test('should reject invalid gamemodes', () => {
      expect(() => GetPlayerStatsSchema.parse({ 
        username: 'Test', 
        gamemode: 'invalid' 
      })).toThrow();
    });
  });

  describe('GetSkillLeaderboardSchema', () => {
    test('should validate correct skill leaderboard params', () => {
      const validParams = { 
        skill: 'attack', 
        gamemode: 'ironman', 
        page: 2 
      };
      expect(() => GetSkillLeaderboardSchema.parse(validParams)).not.toThrow();
    });

    test('should use default page value', () => {
      const params = { skill: 'attack' };
      const result = GetSkillLeaderboardSchema.parse(params);
      expect(result.page).toBe(1);
    });

    test('should reject invalid skills', () => {
      expect(() => GetSkillLeaderboardSchema.parse({ 
        skill: 'invalid_skill' 
      })).toThrow();
    });

    test('should reject invalid page numbers', () => {
      expect(() => GetSkillLeaderboardSchema.parse({ 
        skill: 'attack', 
        page: 0 
      })).toThrow();
    });
  });

  describe('GetActivityLeaderboardSchema', () => {
    test('should validate correct activity leaderboard params', () => {
      const validParams = { 
        activity: 'zulrah', 
        gamemode: 'main', 
        page: 1 
      };
      expect(() => GetActivityLeaderboardSchema.parse(validParams)).not.toThrow();
    });

    test('should accept clue scroll activities', () => {
      const validParams = { activity: 'clue_scrolls_all' };
      expect(() => GetActivityLeaderboardSchema.parse(validParams)).not.toThrow();
    });

    test('should reject invalid activities', () => {
      expect(() => GetActivityLeaderboardSchema.parse({ 
        activity: 'invalid_activity' 
      })).toThrow();
    });
  });

  describe('ComparePlayersSchema', () => {
    test('should validate correct compare players params', () => {
      const validParams = { 
        usernames: ['Player1', 'Player2'], 
        focus: 'skills' 
      };
      expect(() => ComparePlayersSchema.parse(validParams)).not.toThrow();
    });

    test('should use default focus value', () => {
      const params = { usernames: ['Player1', 'Player2'] };
      const result = ComparePlayersSchema.parse(params);
      expect(result.focus).toBe('all');
    });

    test('should accept up to 5 usernames', () => {
      const validParams = { 
        usernames: ['P1', 'P2', 'P3', 'P4', 'P5'] 
      };
      expect(() => ComparePlayersSchema.parse(validParams)).not.toThrow();
    });

    test('should reject less than 2 usernames', () => {
      expect(() => ComparePlayersSchema.parse({ 
        usernames: ['OnlyOne'] 
      })).toThrow();
    });

    test('should reject more than 5 usernames', () => {
      expect(() => ComparePlayersSchema.parse({ 
        usernames: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] 
      })).toThrow();
    });

    test('should reject invalid focus values', () => {
      expect(() => ComparePlayersSchema.parse({ 
        usernames: ['P1', 'P2'], 
        focus: 'invalid' 
      })).toThrow();
    });

    test('should reject usernames that are too long', () => {
      expect(() => ComparePlayersSchema.parse({ 
        usernames: ['ThisUsernameIsTooLong', 'P2'] 
      })).toThrow();
    });
  });
});