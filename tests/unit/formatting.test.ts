import { 
  formatPlayerStats, 
  formatLeaderboardEntry, 
  sanitizeUsername, 
  formatNumber 
} from '../../src/utils/formatting';

describe('Formatting Utils', () => {
  describe('formatPlayerStats', () => {
    test('should format player stats correctly', () => {
      const rawData = {
        skills: {
          attack: { rank: 1000, level: 99, xp: 13034431 },
          defence: { rank: 2000, level: 85, xp: 3258594 }
        },
        bosses: {
          zulrah: { rank: 500, score: 1000 }
        },
        activities: {
          clue_scrolls_all: { rank: 300, score: 50 }
        }
      };

      const result = formatPlayerStats(rawData, 'TestPlayer', 'main');

      expect(result.username).toBe('TestPlayer');
      expect(result.gamemode).toBe('main');
      expect(result.skills.attack).toEqual({
        rank: 1000,
        level: 99,
        experience: 13034431
      });
      expect(result.bosses.zulrah).toEqual({
        rank: 500,
        score: 1000
      });
    });

    test('should handle empty data gracefully', () => {
      const rawData = {};
      const result = formatPlayerStats(rawData, 'TestPlayer', 'ironman');

      expect(result.username).toBe('TestPlayer');
      expect(result.gamemode).toBe('ironman');
      expect(result.skills).toEqual({});
      expect(result.bosses).toEqual({});
      expect(result.activities).toEqual({});
    });
  });

  describe('formatLeaderboardEntry', () => {
    test('should format skill leaderboard entry', () => {
      const rawEntry = {
        rank: 1,
        username: 'TopPlayer',
        level: 99,
        xp: 13034431
      };

      const result = formatLeaderboardEntry(rawEntry, true);

      expect(result).toEqual({
        rank: 1,
        username: 'TopPlayer',
        level: 99,
        experience: 13034431
      });
    });

    test('should format activity leaderboard entry', () => {
      const rawEntry = {
        rank: 5,
        username: 'BossKiller',
        score: 1500
      };

      const result = formatLeaderboardEntry(rawEntry, false);

      expect(result).toEqual({
        rank: 5,
        username: 'BossKiller',
        score: 1500
      });
    });

    test('should handle missing data with defaults', () => {
      const rawEntry = {};
      const result = formatLeaderboardEntry(rawEntry, true);

      expect(result.rank).toBe(-1);
      expect(result.username).toBe('Unknown');
      expect(result.level).toBe(1);
      expect(result.experience).toBe(0);
    });
  });

  describe('sanitizeUsername', () => {
    test('should trim whitespace', () => {
      expect(sanitizeUsername('  TestPlayer  ')).toBe('TestPlayer');
    });

    test('should normalize multiple spaces', () => {
      expect(sanitizeUsername('Test   Player')).toBe('Test Player');
    });

    test('should handle already clean usernames', () => {
      expect(sanitizeUsername('CleanUsername')).toBe('CleanUsername');
    });
  });

  describe('formatNumber', () => {
    test('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(999)).toBe('999');
    });

    test('should handle zero and negative numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-1000)).toBe('-1,000');
    });
  });
});