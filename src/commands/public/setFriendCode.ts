/* eslint-disable camelcase */
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { oneLine, stripIndents } from 'common-tags';

import KirbotCommand from '../../helpers/KirbotCommand';
import { CMD_GROUPS, CMD_NAMES, SETTINGS } from '../../helpers/constants';
import { logger, getLogTag } from '../../helpers/logger';
import logCommandStart from '../../helpers/logCommandStart';

interface CommandArgs {
  code: string;
}

/**
 * Expect values like this:
 * SW-1234-5678-9012
 * SW 1234 5678 9012
 * 1234-5678-9012
 * 1234 5678 9012
 */
const regexFriendCode = /^(?:sw[- ])?([\d]{4}[- ][\d]{4}[- ][\d]{4})$/i;

export default class SetFriendCodeCommand extends KirbotCommand {
  constructor (client: CommandoClient) {
    super(client, {
      name: CMD_NAMES.PUBLIC_SET_FRIEND_CODE,
      group: CMD_GROUPS.PUBLIC,
      memberName: 'friend_code_set',
      description: 'Register your Nintendo Switch friend code',
      details: stripIndents`
        Register your friend code so that others can easily add you!
      `,
      guildOnly: true,
      examples: [
        `${CMD_NAMES.PUBLIC_SET_FRIEND_CODE} SW 1234 5678 9012`,
      ],
      args: [
        {
          key: 'code',
          type: 'string',
          prompt: 'what is your Nintendo Switch friend code?',
        },
      ],
    });
  }

  async run (message: CommandoMessage, { code }: CommandArgs) {
    const { id, member } = message;

    const tag = getLogTag(id);

    logCommandStart(tag, message);

    // User is registering a friend code for their self
    logger.info(tag, `Validating friend code "${code}"`);

    // Make sure the friend code is correctly formatted
    const matched = regexFriendCode.test(code);

    if (!matched) {
      logger.info(tag, 'Invalid friend code, exiting');

      return message.reply(oneLine`
        that doesn't appear to be a valid friend code. Try again (hint:
        try entering it as **SW 1234 5678 9012**)
      `);
    }

    logger.info(tag, 'Friend code matches expected format');

    logger.info(
      tag,
      `Registering friend code "${code}" for ${member.user.tag} (${member.id})`,
    );

    let currentCodes = this.client.settings.get(SETTINGS.FRIEND_CODES);
    if (!currentCodes) {
      currentCodes = {};
    }

    let normalized = code.replace(/-/g, ' ').toUpperCase();
    if (normalized.substr(0, 3) !== 'SW ') {
      // Ensure friend code starts with SW
      normalized = `SW ${normalized}`;
    }

    currentCodes[member.id] = normalized;

    this.client.settings.set(SETTINGS.FRIEND_CODES, currentCodes);

    return message.reply(`your friend code is now **${normalized}**`);
  }
}
