import { BaseDatabaseService, databaseService } from './database';

// Settings are a JSON blob in a single table in SQLite for now. These are values within the blob
type FriendCodes = { [key: string]: string };
type Settings = {
  friendCodes?: FriendCodes,
};

class BaseSettingsService {
  private dbService: BaseDatabaseService;

  constructor (dbService: BaseDatabaseService) {
    this.dbService = dbService;
  }

  private async getSettings (): Promise<Settings> {
    const results: { settings: string } =
      await this.dbService.get('SELECT settings FROM settings LIMIT 1');

    return JSON.parse(results.settings) as Settings;
  }

  async getFriendCodes (): Promise<FriendCodes> {
    let { friendCodes } = await this.getSettings();

    if (!friendCodes) {
      friendCodes = {};
    }

    return friendCodes;
  }
}

export const settingsService = new BaseSettingsService(databaseService);
