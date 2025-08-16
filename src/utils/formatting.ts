import { PlayerStats, LeaderboardEntry, ActivityData, SkillData } from '../types/osrs-types.js';

export function formatPlayerStats(rawData: any, username: string, gamemode: string = 'main'): PlayerStats {
  return {
    username,
    gamemode,
    skills: formatSkillStats(rawData.skills || {}),
    activities: formatActivityStats(rawData.activities || {}),
    bosses: formatBossStats(rawData.bosses || {})
  };
}

export function formatSkillStats(rawSkills: any): any {
  const formatted: any = {};
  
  for (const [skillName, skillData] of Object.entries(rawSkills)) {
    if (skillData && typeof skillData === 'object') {
      formatted[skillName] = {
        rank: (skillData as any).rank || -1,
        level: (skillData as any).level || 1,
        experience: (skillData as any).xp || 0
      };
    }
  }
  
  return formatted;
}

export function formatActivityStats(rawActivities: any): { [key: string]: ActivityData } {
  const formatted: { [key: string]: ActivityData } = {};
  
  for (const [activityName, activityData] of Object.entries(rawActivities)) {
    if (activityData && typeof activityData === 'object') {
      formatted[activityName] = {
        rank: (activityData as any).rank || -1,
        score: (activityData as any).score || 0
      };
    }
  }
  
  return formatted;
}

export function formatBossStats(rawBosses: any): { [key: string]: ActivityData } {
  const formatted: { [key: string]: ActivityData } = {};
  
  for (const [bossName, bossData] of Object.entries(rawBosses)) {
    if (bossData && typeof bossData === 'object') {
      formatted[bossName] = {
        rank: (bossData as any).rank || -1,
        score: (bossData as any).score || 0
      };
    }
  }
  
  return formatted;
}

export function formatLeaderboardEntry(rawEntry: any, isSkill: boolean = false): LeaderboardEntry {
  const entry: LeaderboardEntry = {
    rank: rawEntry.rank || -1,
    username: rawEntry.username || rawEntry.name || 'Unknown'
  };

  if (isSkill) {
    entry.level = rawEntry.level || 1;
    entry.experience = rawEntry.xp || rawEntry.experience || 0;
  } else {
    entry.score = rawEntry.score || 0;
  }

  return entry;
}

export function sanitizeUsername(username: string): string {
  return username.trim().replace(/\s+/g, ' ');
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}