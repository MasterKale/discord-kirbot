import { Client, GatewayIntentBits } from 'discord.js';

import { DISCORD_BOT_TOKEN } from './helpers/constants';
import { logger } from './helpers/logger';
import { databaseService } from './services/database';

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
// Initialize our database
DatabaseService.initialize(logger);


bot.once('ready', () => {
  if (!bot.user) {
    logger.error('Bot initialized but has no user, how did this happen?');
    throw new Error('Bot initialized but has no user, how did this happen?');
  }

  logger.info('KIRBOT GO! <(^.^)>');
  logger.info(`Logged in as ${bot.user.tag}`);

  bot.user.setActivity('<(\'.\'<)');
});

bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const { commandName } = interaction;

  logger.info(commandName);
});

// Handle errors
bot.on('error', (err) => {
  logger.error(err, 'Bot system error');
});

// Start the bot
bot.login(DISCORD_BOT_TOKEN);
