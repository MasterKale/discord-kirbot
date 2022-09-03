import { ChatInputCommandInteraction } from 'discord.js';
import { getLogTag, logger, LogTag } from './logger';

/**
 * Help ensure consistent logging at the beginning of a command's execution
 */
export function logCommandStart (interaction: ChatInputCommandInteraction): LogTag {
  const { id, commandName, member, options } = interaction;

  const tag = getLogTag(id);

  let memberTag = 'Unknown Member';
  let memberID = '???';
  if (member) {
    memberTag = `${member.user.username}#${member.user.discriminator}`;
    memberID = member.user.id;
  }

  let subCommandLog = '';
  const subCommandName = options.getSubcommand();
  if (subCommandName) {
    subCommandLog = ` (sub-command: ${subCommandName})`;
  }

  logger.info(tag, `[COMMAND START: ${commandName}${subCommandLog}]`);

  logger.debug(tag, `Called by ${memberTag} (${memberID})`);

  return tag;
}
