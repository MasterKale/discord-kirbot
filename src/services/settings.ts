import { BaseDatabaseService, databaseService } from './database';

// Settings are a JSON blob in a single table in SQLite for now. These are values within the blob
type FriendCodes = { [key: string]: string };

class BaseSettingsService {
  private dbService: BaseDatabaseService;

  constructor (dbService: BaseDatabaseService) {
    this.dbService = dbService;
  }

  async getFriendCodes (): Promise<FriendCodes> {
    let { friendCodes } = await this.dbService.get(
      'SELECT json_extract(settings, "$.friendCodes") AS friendCodes FROM settings LIMIT 1',
    );

    if (!friendCodes) {
      friendCodes = '{}';
    }

    return JSON.parse(friendCodes);
  }

  async addFriendCode (userId: string, code: string): Promise<void> {
    await this.dbService.run(
      `UPDATE settings SET settings = json_set(settings, '$.friendCodes.${userId}', '${code}')`,
    );
  }
}

export const settingsService = new BaseSettingsService(databaseService);
