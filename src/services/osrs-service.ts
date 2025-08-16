import { getStatsByGamemode, getSkillPage, getActivityPage } from 'osrs-json-hiscores';
import { 
  PlayerStats, 
  LeaderboardResponse, 
  PlayerComparison, 
  GameMode,
  OSRSError 
} from '../types/osrs-types.js';
import { formatPlayerStats, formatLeaderboardEntry, sanitizeUsername } from '../utils/formatting.js';

export class OSRSService {
  constructor() {
  }

  async getPlayerStats(username: string, gamemode: GameMode = 'main'): Promise<PlayerStats> {
    try {
      const sanitizedUsername = sanitizeUsername(username);
      const rawData = await getStatsByGamemode(sanitizedUsername, gamemode as any);
      
      return formatPlayerStats(rawData, sanitizedUsername, gamemode);
    } catch (error: any) {
      throw new OSRSError({
        code: 'API_ERROR',
        message: `Failed to fetch player stats: ${error.message}`,
        details: error
      });
    }
  }

  async getSkillLeaderboard(
    skill: string, 
    gamemode: GameMode = 'main', 
    page: number = 1
  ): Promise<LeaderboardResponse> {
    try {
      const rawData = await getSkillPage(skill as any, gamemode as any, page);
      
      const entries = rawData.map((entry: any) => formatLeaderboardEntry(entry, true));
      
      return {
        skill,
        gamemode,
        page,
        entries
      };
    } catch (error: any) {
      throw new OSRSError({
        code: 'API_ERROR',
        message: `Failed to fetch skill leaderboard: ${error.message}`,
        details: error
      });
    }
  }

  async getActivityLeaderboard(
    activity: string, 
    gamemode: GameMode = 'main', 
    page: number = 1
  ): Promise<LeaderboardResponse> {
    try {
      const rawData = await getActivityPage(activity as any, gamemode as any, page);
      
      const entries = rawData.map((entry: any) => formatLeaderboardEntry(entry, false));
      
      return {
        activity,
        gamemode,
        page,
        entries
      };
    } catch (error: any) {
      throw new OSRSError({
        code: 'API_ERROR',
        message: `Failed to fetch activity leaderboard: ${error.message}`,
        details: error
      });
    }
  }

  async comparePlayers(
    usernames: string[], 
    focus: 'skills' | 'bosses' | 'activities' | 'all' = 'all'
  ): Promise<PlayerComparison> {
    try {
      const sanitizedUsernames = usernames.map(sanitizeUsername);
      const playerDataPromises = sanitizedUsernames.map(username => 
        this.getPlayerStats(username)
      );
      
      const playersData = await Promise.all(playerDataPromises);
      
      const comparison: any = {};
      
      if (focus === 'skills' || focus === 'all') {
        comparison.skills = this.compareSkills(playersData);
      }
      
      if (focus === 'bosses' || focus === 'all') {
        comparison.bosses = this.compareBosses(playersData);
      }
      
      if (focus === 'activities' || focus === 'all') {
        comparison.activities = this.compareActivities(playersData);
      }
      
      return {
        usernames: sanitizedUsernames,
        focus,
        comparison
      };
    } catch (error: any) {
      if (error instanceof OSRSError) {
        throw error;
      }
      throw new OSRSError({
        code: 'API_ERROR',
        message: `Failed to compare players: ${error.message}`,
        details: error
      });
    }
  }

  private compareSkills(playersData: PlayerStats[]): { [skill: string]: { [username: string]: any } } {
    const comparison: any = {};
    
    const skillNames = Object.keys(playersData[0]?.skills || {});
    
    for (const skill of skillNames) {
      comparison[skill] = {};
      for (const player of playersData) {
        comparison[skill][player.username] = player.skills[skill as keyof typeof player.skills];
      }
    }
    
    return comparison;
  }

  private compareBosses(playersData: PlayerStats[]): { [boss: string]: { [username: string]: any } } {
    const comparison: any = {};
    
    const allBosses = new Set<string>();
    playersData.forEach(player => {
      Object.keys(player.bosses).forEach(boss => allBosses.add(boss));
    });
    
    for (const boss of allBosses) {
      comparison[boss] = {};
      for (const player of playersData) {
        comparison[boss][player.username] = player.bosses[boss] || { rank: -1, score: 0 };
      }
    }
    
    return comparison;
  }

  private compareActivities(playersData: PlayerStats[]): { [activity: string]: { [username: string]: any } } {
    const comparison: any = {};
    
    const allActivities = new Set<string>();
    playersData.forEach(player => {
      Object.keys(player.activities).forEach(activity => allActivities.add(activity));
    });
    
    for (const activity of allActivities) {
      comparison[activity] = {};
      for (const player of playersData) {
        comparison[activity][player.username] = player.activities[activity] || { rank: -1, score: 0 };
      }
    }
    
    return comparison;
  }
}