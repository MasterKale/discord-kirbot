import { SlashCommandBuilder, GuildMemberRoleManager, Role } from 'discord.js';

import {
  KirbotCommandHandler,
  KirbotCommandName,
  API_ERROR,
  recoverableErrors,
} from '../helpers/constants';
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

  const role = options.getRole(Options.Role, true) as Role;

  logger.info(tag, `Toggling role "${role.name}"`);

  const roleManager = member.roles as GuildMemberRoleManager;
  try {
    const hasRole = roleManager.cache.has(role.id);

    let reply;
    if (hasRole) {
      logger.info(tag, 'Member has role, removing role');
      await roleManager.remove(role, 'Toggled role off');
      reply = `You no longer have the **${role.name}** role`;
    } else {
      logger.info(tag, 'Member does not have role, adding role');
      await roleManager.add(role, 'Toggled role on');
      reply = `You now have the **${role.name}** role`;
    }

    return interaction.reply(reply);
  } catch (err) {
    if (recoverableErrors.indexOf(err.code) >= 0) {
      logger.info(tag, 'User tried to toggle a role above them');
      return interaction.reply('That role cannot be toggled, please try again.');
    } else {
      logger.info({ ...tag, err }, 'Error toggling role');
      throw err;
    }
  }
};
