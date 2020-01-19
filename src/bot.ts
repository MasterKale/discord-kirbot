import { CommandoClient, SQLiteProvider } from 'discord.js-commando';
import sqlite from 'sqlite';
import path from 'path';

import { DISCORD_BOT_TOKEN, CMD_GROUPS } from './helpers/constants';
import { logger } from './helpers/logger';

const bot = new CommandoClient({
  commandPrefix: '<',
  owner: '',
  disabledEvents: [
    'TYPING_START',
  ],
});

// Set up a SQLite DB to preserve guide-specific command availability
sqlite.open(path.join(__dirname, '../settings.db'))
  .then(db => bot.setProvider(new SQLiteProvider(db)))
  .catch(error => { logger.error('Error loading SQLite DB:', error); });

// Initialize commands and command groups
bot.registry
  .registerDefaultTypes()
  .registerGroups([
    [CMD_GROUPS.PUBLIC, 'For Everyone'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
    help: false,
    prefix: false,
  })
  // Automatically load commands that exist in the commands/ directory
  // A custom filter is specified so that the `require-all` library picks up .ts files during dev
  .registerCommandsIn({
    dirname: path.join(__dirname, 'commands'),
    filter: /^([^.].*)\.[jt]s$/,
  });

bot.once('ready', () => {
  if (!bot.user) {
    logger.error('Bot initialized but has no user, how did this happen?');
    throw new Error('Bot initialized but has no user, how did this happen?');
  }

  logger.info('KIRBOT GO! <(^.^)>');
  logger.info(`Logged in as ${bot.user.tag}`);
  logger.info(`Command prefix: ${bot.commandPrefix}`);

  bot.user.setActivity('<(\'.\'<)');
});

// Handle errors
bot.on('error', (err) => {
  if (err.message === 'Cannot read property \'trim\' of undefined') {
    // Swallow a bug in discord.js-commando at:
    // node_modules/discord.js-commando/src/extensions/message.js:109:28
  } else {
    logger.error(err, 'Bot system error');
  }
});

// Start the bot
bot.login(DISCORD_BOT_TOKEN);
