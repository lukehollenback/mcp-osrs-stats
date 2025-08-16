import { OSRSError } from '../types/osrs-types.js';
import { VALID_SKILLS, VALID_ACTIVITIES, VALID_BOSSES, VALID_GAMEMODES } from '../types/mcp-types.js';

export function validateUsername(username: string): void {
  if (!username || typeof username !== 'string') {
    throw new OSRSError({
      code: 'INVALID_USERNAME',
      message: 'Username must be a non-empty string'
    });
  }

  if (username.length > 12) {
    throw new OSRSError({
      code: 'INVALID_USERNAME',
      message: 'Username cannot be longer than 12 characters'
    });
  }

  if (!/^[a-zA-Z0-9_\- ]+$/.test(username)) {
    throw new OSRSError({
      code: 'INVALID_USERNAME',
      message: 'Username contains invalid characters'
    });
  }
}

export function validateGameMode(gamemode?: string): void {
  if (gamemode && !VALID_GAMEMODES.includes(gamemode as any)) {
    throw new OSRSError({
      code: 'INVALID_GAMEMODE',
      message: `Invalid gamemode: ${gamemode}. Valid options: ${VALID_GAMEMODES.join(', ')}`
    });
  }
}

export function validateSkillName(skill: string): void {
  if (!VALID_SKILLS.includes(skill.toLowerCase() as any)) {
    throw new OSRSError({
      code: 'INVALID_SKILL',
      message: `Invalid skill name: ${skill}. Valid skills: ${VALID_SKILLS.join(', ')}`
    });
  }
}

export function validateActivityName(activity: string): void {
  const allActivities = [...VALID_ACTIVITIES, ...VALID_BOSSES];
  if (!allActivities.includes(activity.toLowerCase() as any)) {
    throw new OSRSError({
      code: 'INVALID_ACTIVITY',
      message: `Invalid activity/boss name: ${activity}. Check the documentation for valid options.`
    });
  }
}

export function validatePage(page?: number): void {
  if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
    throw new OSRSError({
      code: 'INVALID_PAGE',
      message: 'Page must be a positive integer'
    });
  }
}