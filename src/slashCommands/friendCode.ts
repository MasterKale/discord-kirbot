import { SlashCommandBuilder } from 'discord.js';
import { oneLine } from 'common-tags';

import { logger } from '../helpers/logger';
import {
  KirbotCommandName,
  KirbotCommandHandler,
  KirbotSubCommandHandler,
} from '../helpers/constants';
import { logCommandStart } from '../helpers/logCommandStart';
import { getMemberTag } from '../helpers/getMemberTag';
import { settingsService } from '../services/settings';

enum Options {
  Friend = 'friend',
  Code = 'code',
}

enum SubCommand {
  Get = 'get',
  Set = 'set',
}

/**
 * Expect values like this:
 * SW-1234-5678-9012
 * SW 1234 5678 9012
 * 1234-5678-9012
 * 1234 5678 9012
 */
const regexFriendCode = /^(?:sw[- ])?([\d]{4}[- ][\d]{4}[- ][\d]{4})$/i;

export const config = new SlashCommandBuilder()
  .setName('friend-code' as KirbotCommandName)
  .setDescription('Switch Friend Codes Lookup')
  .addSubcommand(subcommand =>
    subcommand
      .setName(SubCommand.Get)
      .setDescription('Look up your or someone else\'s Switch friend code')
      .addUserOption(option =>
        option
          .setName(Options.Friend)
          .setDescription('Whose friend code are you interested in?')
          .setRequired(false),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName(SubCommand.Set)
      .setDescription('Register your Switch friend code so that others can easily add you')
      .addStringOption(option =>
        option
          .setName(Options.Code)
          .setDescription('Your Switch friend code as SW 1234 5678 9012')
          .setRequired(true),
      ),
  );

/**
 * Get and set Switch Friend Codes
 */
export const handler: KirbotCommandHandler = async (interaction) => {
  const { options } = interaction;

  const tag = logCommandStart(interaction);

  const subCommand = options.getSubcommand() as SubCommand;

  if (subCommand === SubCommand.Get) {
    return handleGet(tag, interaction);
  }

  if (subCommand === SubCommand.Set) {
    return handleSet(tag, interaction);
  }

  throw new Error(`friend-code received unexpected sub-command ${subCommand}`);
};

const handleGet: KirbotSubCommandHandler = async (tag, interaction) => {
  const { options, member } = interaction;

  if (!member) {
    logger.error(tag, 'How did this command get invoked by a non-member?');
    throw new Error('How did this command get invoked by a non-member?');
  }

  const target = options.getUser(Options.Friend);
  const friendCodes = await settingsService.getFriendCodes();

  let response: string;

  if (target) {
    // Getting someone else's friend code
    const friendFriendCode = friendCodes[target.id];

    if (friendFriendCode) {
      response = `${target}'s friend code is ${friendFriendCode}`;
    } else {
      response = `I couldn't find a friend code for ${target}...`;
    }
  } else {
    // Getting the invoker's friend code
    const requesterFriendCode = friendCodes[member.user.id];

    if (requesterFriendCode) {
      response = `Your friend code is **${requesterFriendCode}**`;
    } else {
      response = 'I couldn\'t find a friend code for you...';
    }
  }

  logger.debug(tag, `Response: "${response}"`);
  return interaction.reply(response);
};

const handleSet: KirbotSubCommandHandler = async (tag, interaction) => {
  const { options, member } = interaction;

  if (!member) {
    logger.error(tag, 'How did this command get invoked by a non-member?');
    throw new Error('How did this command get invoked by a non-member?');
  }

  const rawCode = options.getString(Options.Code);

  if (!rawCode) {
    throw new Error(`${Options.Code} option cannot be blank`);
  }

  // User is registering a friend code for their self
  logger.info(tag, `Validating friend code "${rawCode}"`);

  // Make sure the friend code is correctly formatted
  const matched = regexFriendCode.test(rawCode);

  if (!matched) {
    logger.info(tag, 'Invalid friend code, exiting');

    return interaction.reply({
      content: oneLine`
        That doesn't appear to be a valid friend code. Try again (hint:
        try entering it as **SW 1234 5678 9012**)
      `,
      ephemeral: true,
    });
  }

  let normalized = rawCode.replace(/-/g, ' ').toUpperCase();
  if (normalized.substring(0, 3) !== 'SW ') {
    // Ensure friend code starts with SW
    normalized = `SW ${normalized}`;
  }

  const memberTag = getMemberTag(member);
  logger.info(tag, `Registering friend code "${normalized}" for ${memberTag} (${member.user.id})`);

  await settingsService.addFriendCode(member.user.id, normalized);

  return interaction.reply(`Your friend code is now **${normalized}**`);
};
