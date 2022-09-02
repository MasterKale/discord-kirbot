import { Client, GatewayIntentBits } from 'discord.js';

import { DISCORD_BOT_TOKEN } from './helpers/constants';
import { logger } from './helpers/logger';
import { DatabaseService } from './services/database';

// const bot = new CommandoClient({
//   commandPrefix: '<',
//   owner: '148474055949942787',
//   disabledEvents: [
//     'TYPING_START',
//   ],
// });
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
// Initialize our database
DatabaseService.initialize(logger);

// Initialize commands and command groups
// bot.registry
//   .registerDefaultTypes()
//   .registerGroups([
//     [CMD_GROUPS.PUBLIC, 'For Everyone'],
//   ])
//   .registerDefaultGroups()
//   .registerDefaultCommands({
//     unknownCommand: false,
//     help: false,
//     prefix: false,
//     commandState: false,
//     ping: false,
//   })
//   // Automatically load commands that exist in the commands/ directory
//   // A custom filter is specified so that the `require-all` library picks up .ts files during dev
//   .registerCommandsIn({
//     dirname: path.join(__dirname, 'commands'),
//     filter: /^([^.].*)\.[jt]s$/,
//   });

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
