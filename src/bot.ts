import { Client, Collection, GatewayIntentBits } from 'discord.js';

import { DISCORD_BOT_TOKEN, KirbotCommandName, KirbotCommandHandler } from './helpers/constants';
import { logger } from './helpers/logger';
import { databaseService } from './services/database';
import { getSlashCommands } from './helpers/getSlashCommands';

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
// Initialize our database
databaseService.initialize(logger);

// Gather commands
const commandHandlers = new Collection<string, KirbotCommandHandler>();
getSlashCommands().forEach(([config, handler]) => {
  commandHandlers.set(config.name, handler);
});

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

  const commandHandler = commandHandlers.get(commandName as KirbotCommandName);

  if (!commandHandler) {
    return;
  }

  try {
    await commandHandler(interaction);
  } catch (err) {
    logger.error(err, `Error executing handler for command "${commandName}"`);
    await interaction.reply({
      content: 'Something went wrong. Please ping an admin for assistance',
      ephemeral: true,
    });
  }
});

// Handle errors
bot.on('error', (err) => {
  logger.error(err, 'Bot system error');
});

// Start the bot
bot.login(DISCORD_BOT_TOKEN);
