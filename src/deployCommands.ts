import { REST, Routes } from 'discord.js';

import {
  DISCORD_BOT_APPLICATION_ID,
  DISCORD_BOT_GUILD_ID,
  DISCORD_BOT_TOKEN,
} from './helpers/constants';
import { logger } from './helpers/logger';
import { getSlashCommands } from './helpers/getSlashCommands';

if (!DISCORD_BOT_APPLICATION_ID) {
  throw new Error('DISCORD_BOT_APPLICATION_ID was not defined');
}

if (!DISCORD_BOT_GUILD_ID) {
  throw new Error('DISCORD_BOT_GUILD_ID was not defined');
}

if (!DISCORD_BOT_TOKEN) {
  throw new Error('DISCORD_BOT_TOKEN was not defined');
}

/**
 * Begin slash command publication
 */
const commands = getSlashCommands().map(([config]) => config.toJSON());

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

rest.put(
  Routes.applicationGuildCommands(DISCORD_BOT_APPLICATION_ID, DISCORD_BOT_GUILD_ID),
  { body: commands },
)
  .then((data: any) => {
    logger.info(`Successfully registered ${data.length} application commands.`);
  })
  .catch((err) => {
    logger.error(err, 'Failed to register application commands');
  });
