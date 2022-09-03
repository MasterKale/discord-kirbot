import { ChatInputCommandInteraction } from 'discord.js';

import { getLogTag, logger, LogTag } from './logger';
import { getMemberTag } from './getMemberTag';

/**
 * Help ensure consistent logging at the beginning of a command's execution
 */
export function logCommandStart (interaction: ChatInputCommandInteraction): LogTag {
  const { id, member } = interaction;

  const tag = getLogTag(id);

  const commandNameLog = interaction.toString();

  let memberTag = 'Unknown Member';
  let memberID = '???';
  if (member) {
    memberTag = getMemberTag(member);
    memberID = member.user.id;
  }

  logger.info(tag, `[COMMAND START: ${commandNameLog}]`);
  logger.debug(tag, `Called by ${memberTag} (${memberID})`);

  return tag;
}
