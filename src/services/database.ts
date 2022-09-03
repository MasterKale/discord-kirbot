import path from 'node:path';

import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import type { Logger } from 'pino';

class BaseDatabaseService {
  private _logger: Logger;
  private _db: sqlite.Database;

  async initialize (logger: Logger) {
    this._logger = logger;

    try {
      const db = await sqlite.open({
        filename: path.join(__dirname, '../../settings.db'),
        driver: sqlite3.Database,
      });

      this._db = db;
    } catch (err) {
      this._logger.error(err, 'Error loading SQLite DB:');
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
