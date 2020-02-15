/* eslint-disable camelcase */
import { GuildMember } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { stripIndents } from 'common-tags';

import KirbotCommand from '../../helpers/KirbotCommand';
import { CMD_GROUPS, CMD_NAMES, SETTINGS } from '../../helpers/constants';
import { logger, getLogTag } from '../../helpers/logger';
import logCommandStart from '../../helpers/logCommandStart';

interface CommandArgs {
  member: GuildMember;
}

export default class SetFriendCodeCommand extends KirbotCommand {
  constructor (client: CommandoClient) {
    super(client, {
      name: CMD_NAMES.PUBLIC_GET_FRIEND_CODE,
      group: CMD_GROUPS.PUBLIC,
      memberName: 'friend_code_get',
      description: 'Get your or someone else\'s Nintendo Switch friend code',
      details: stripIndents`
        Look up each other's friend codes!
      `,
      guildOnly: true,
      examples: [
        `${CMD_NAMES.PUBLIC_GET_FRIEND_CODE}`,
        `${CMD_NAMES.PUBLIC_GET_FRIEND_CODE} @IAmKale`,
      ],
      args: [
        {
          key: 'member',
          type: 'member',
          prompt: 'whose friend code are you interested in?',
          default: (message: CommandoMessage) => message.member,
        },
      ],
    });
  }

  async run (message: CommandoMessage, { member: fcMember }: CommandArgs) {
    const { id, member } = message;

    const tag = getLogTag(id);

    logCommandStart(tag, message);

    let currentCodes = this.client.settings.get(SETTINGS.FRIEND_CODES);
    if (!currentCodes) {
      currentCodes = {};
    }

    logger.info(tag, `Retrieving friend code for ${fcMember.user.tag} (${fcMember.id})`);

    const code = currentCodes[fcMember.id];

    let msgWho;
    if (fcMember === member) {
      msgWho = 'your';
    } else {
      msgWho = `${fcMember}'s`;
    }

    if (!code) {
      logger.info(tag, 'Could not find a friend code');
      return message.reply(`I couldn't find ${msgWho} friend code...`);
    }

    logger.debug(tag, `Replying with friend code: ${code}`);
    return message.reply(`${msgWho} friend code is **${code}**`);
  }
}
