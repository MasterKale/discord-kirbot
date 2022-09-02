import path from 'node:path';

import sqlite from 'sqlite';
import type { Logger } from 'pino';

class BaseDatabaseService {
  private _logger: Logger;
  private _db: sqlite.Database;

  async initialize (logger: Logger) {
    this._logger = logger;

    try {
      const db = await sqlite.open({
        filename: path.join(__dirname, '../settings.db'),
        driver: sqlite.Database,
      });

      this._db = db;
    } catch (err) {
      const _err = err as Error;
      this._logger.error('Error loading SQLite DB:', _err);
    }
  }

  get db (): sqlite.Database {
    if (!this._db) {
      throw new Error('Please call `initialize()` before attempting to access the database');
    }

    return this._db;
  }
}

export const DatabaseService = new BaseDatabaseService();
