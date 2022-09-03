import { SlashCommandBuilder } from 'discord.js';

import { KirbotCommandHandler, KirbotCommandName } from '../helpers/constants';
import { logger } from '../helpers/logger';
import { logCommandStart } from '../helpers/logCommandStart';

enum Options {
  Role = 'role',
}

/**
 * A command to add or remove a role from yourself
 */
export const config = new SlashCommandBuilder()
  .setName('toggle-role' as KirbotCommandName)
  .setDescription('Add or remove a server role on yourself')
  .addRoleOption(option =>
    option
      .setName(Options.Role)
      .setDescription('Which role are you interested in?')
      .setRequired(true),
  );

export const handler: KirbotCommandHandler = async (interaction) => {
  const { options, member } = interaction;

  const tag = logCommandStart(interaction);

  if (!member) {
    logger.error(tag, 'How did this command get invoked by a non-member?');
    throw new Error('How did this command get invoked by a non-member?');
  }

  const role = options.getRole(Options.Role, true);

  return interaction.reply(`Toggle Role: ${role}`);
};
