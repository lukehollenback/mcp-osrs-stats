export interface PlayerStats {
  username: string;
  gamemode: string;
  skills: SkillStats;
  activities: ActivityStats;
  bosses: BossStats;
}

export interface SkillStats {
  overall: SkillData;
  attack: SkillData;
  defence: SkillData;
  strength: SkillData;
  hitpoints: SkillData;
  ranged: SkillData;
  prayer: SkillData;
  magic: SkillData;
  cooking: SkillData;
  woodcutting: SkillData;
  fletching: SkillData;
  fishing: SkillData;
  firemaking: SkillData;
  crafting: SkillData;
  smithing: SkillData;
  mining: SkillData;
  herblore: SkillData;
  agility: SkillData;
  thieving: SkillData;
  slayer: SkillData;
  farming: SkillData;
  runecrafting: SkillData;
  hunter: SkillData;
  construction: SkillData;
}

export interface SkillData {
  rank: number;
  level: number;
  experience: number;
}

export interface ActivityStats {
  [key: string]: ActivityData;
}

export interface BossStats {
  [key: string]: ActivityData;
}

export interface ActivityData {
  rank: number;
  score: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  level?: number;
  experience?: number;
  score?: number;
}

export interface LeaderboardResponse {
  skill?: string;
  activity?: string;
  gamemode: string;
  page: number;
  entries: LeaderboardEntry[];
}

export interface PlayerComparison {
  usernames: string[];
  focus: 'skills' | 'bosses' | 'activities' | 'all';
  comparison: ComparisonData;
}

export interface ComparisonData {
  skills?: { [skill: string]: { [username: string]: SkillData } };
  bosses?: { [boss: string]: { [username: string]: ActivityData } };
  activities?: { [activity: string]: { [username: string]: ActivityData } };
}

export type GameMode = 'main' | 'ironman' | 'hardcore_ironman' | 'ultimate_ironman' | 'deadman' | 'seasonal';

export class OSRSError extends Error {
  public code: string;
  public details?: any;

  constructor(options: { code: string; message: string; details?: any }) {
    super(options.message);
    this.code = options.code;
    this.details = options.details;
    this.name = 'OSRSError';
  }
}