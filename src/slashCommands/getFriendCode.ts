import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { logger } from '../helpers/logger';
import {
  KirbotCommandConfig,
  KirbotCommandName,
  KirbotCommandHandler,
} from '../helpers/constants';
import { logCommandStart } from '../helpers/logCommandStart';
import { settingsService } from '../services/settings';

const OPTIONS = {
  FRIEND: 'friend',
};

export const config: KirbotCommandConfig = new SlashCommandBuilder()
  .setName('fc' as KirbotCommandName)
  .setDescription('Get your or someone else\'s Nintendo Switch friend code')
  .addUserOption(option => option.setName(OPTIONS.FRIEND)
    .setDescription('Whose friend code are you interested in?')
    .setRequired(false),
  );

export const handler: KirbotCommandHandler = async (interaction: ChatInputCommandInteraction) => {
  const { options, member: requestingMember } = interaction;
  const optionsFriendUser = options.getUser(OPTIONS.FRIEND);

  const tag = logCommandStart(interaction);

  if (!requestingMember) {
    logger.error(tag, 'How did this command get invoked by a non-member?');
    throw new Error('How did this command get invoked by a non-member?');
  }

  const friendCodes = await settingsService.getFriendCodes();

  let response: string;

  if (optionsFriendUser) {
    const friendFriendCode = friendCodes[optionsFriendUser.id];

    if (friendFriendCode) {
      response = `${optionsFriendUser}'s friend code is ${friendFriendCode}`;
    } else {
      response = `I couldn't find a friend code for ${optionsFriendUser}...`;
    }
  } else {
    const requesterFriendCode = friendCodes[requestingMember.user.id];

    if (requesterFriendCode) {
      response = `your friend code is **${requesterFriendCode}**`;
    } else {
      response = 'I couldn\'t find a friend code for you...';
    }
  }

  logger.debug(tag, `Response: "${response}"`);
  return interaction.reply(`${requestingMember}, ${response}`);
};
