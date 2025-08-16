import { z } from 'zod';

// Valid OSRS skills
export const VALID_SKILLS = [
  'overall', 'attack', 'defence', 'strength', 'hitpoints', 'ranged', 'prayer', 'magic',
  'cooking', 'woodcutting', 'fletching', 'fishing', 'firemaking', 'crafting', 'smithing',
  'mining', 'herblore', 'agility', 'thieving', 'slayer', 'farming', 'runecrafting',
  'hunter', 'construction'
] as const;

// Common OSRS activities and bosses (subset - full list would be quite long)
export const VALID_ACTIVITIES = [
  'clue_scrolls_all', 'clue_scrolls_beginner', 'clue_scrolls_easy', 'clue_scrolls_medium',
  'clue_scrolls_hard', 'clue_scrolls_elite', 'clue_scrolls_master', 'lms_rank',
  'bounty_hunter_hunter', 'bounty_hunter_rogue', 'soul_wars_zeal'
] as const;

export const VALID_BOSSES = [
  'abyssal_sire', 'alchemical_hydra', 'barrows_chests', 'bryophyta', 'callisto', 'cerberus',
  'chambers_of_xeric', 'chambers_of_xeric_challenge_mode', 'chaos_elemental', 'chaos_fanatic',
  'commander_zilyana', 'corporeal_beast', 'crazy_archaeologist', 'dagannoth_prime',
  'dagannoth_rex', 'dagannoth_supreme', 'deranged_archaeologist', 'general_graardor',
  'giant_mole', 'grotesque_guardians', 'hespori', 'kalphite_queen', 'king_black_dragon',
  'kraken', 'kreearra', 'kril_tsutsaroth', 'mimic', 'nex', 'nightmare', 'phosanis_nightmare',
  'obor', 'sarachnis', 'scorpia', 'skotizo', 'tempoross', 'the_gauntlet',
  'the_corrupted_gauntlet', 'theatre_of_blood', 'theatre_of_blood_hard_mode',
  'thermonuclear_smoke_devil', 'tzkal_zuk', 'tztok_jad', 'venenatis', 'vetion', 'vorkath',
  'wintertodt', 'zalcano', 'zulrah'
] as const;

export const VALID_GAMEMODES = [
  'main', 'ironman', 'hardcore_ironman', 'ultimate_ironman', 'deadman', 'seasonal'
] as const;

export const GetPlayerStatsSchema = z.object({
  username: z.string().min(1, 'Username is required').max(12, 'Username too long'),
  gamemode: z.enum(VALID_GAMEMODES).optional()
});

export const GetSkillLeaderboardSchema = z.object({
  skill: z.enum(VALID_SKILLS),
  gamemode: z.enum(VALID_GAMEMODES).optional(),
  page: z.number().min(1).optional().default(1)
});

export const GetActivityLeaderboardSchema = z.object({
  activity: z.enum([...VALID_ACTIVITIES, ...VALID_BOSSES]),
  gamemode: z.enum(VALID_GAMEMODES).optional(),
  page: z.number().min(1).optional().default(1)
});

export const ComparePlayersSchema = z.object({
  usernames: z.array(z.string().min(1).max(12)).min(2, 'At least 2 usernames required').max(5, 'Maximum 5 usernames allowed'),
  focus: z.enum(['skills', 'bosses', 'activities', 'all']).optional().default('all')
});

export type GetPlayerStatsParams = z.infer<typeof GetPlayerStatsSchema>;
export type GetSkillLeaderboardParams = z.infer<typeof GetSkillLeaderboardSchema>;
export type GetActivityLeaderboardParams = z.infer<typeof GetActivityLeaderboardSchema>;
export type ComparePlayersParams = z.infer<typeof ComparePlayersSchema>;