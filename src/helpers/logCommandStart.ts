import { ChatInputCommandInteraction } from 'discord.js';
import { getLogTag, logger, LogTag } from './logger';

/**
 * Help ensure consistent logging at the beginning of a command's execution
 */
export function logCommandStart (interaction: ChatInputCommandInteraction): LogTag {
  const { id, commandName, member } = interaction;

  const tag = getLogTag(id);

  let memberTag = 'Unknown Member';
  let memberID = '???';
  if (member) {
    memberTag = `${member.user.username}#${member.user.discriminator}`;
    memberID = member.user.id;
  }

  logger.info(tag, `[COMMAND START: ${commandName}]`);

  logger.debug(tag, `Called by ${memberTag} (${memberID})`);

  return tag;
}
