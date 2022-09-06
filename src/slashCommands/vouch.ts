import { GuildMemberRoleManager, SlashCommandBuilder, User } from 'discord.js';

import { logCommandStart } from '../helpers/logCommandStart';
import { logger } from '../helpers/logger';
import { getMemberTag } from '../helpers/getMemberTag';
import {
  KirbotCommandHandler,
  KirbotCommandName,
  DISCORD_GUILD_VOUCH_ROLE_ID,
} from '../helpers/constants';

enum Options {
  Friend = 'friend',
}

const emojiKirbot = '<:kirbot:363386626837315584>';
const emojiKirybgun = '<:kirbygun:641427030004596756>';

export const config = new SlashCommandBuilder()
  .setName('vouch' as KirbotCommandName)
  .setDescription('Help your friends get access to the rest of the server')
  .addUserOption(option =>
    option
      .setName(Options.Friend)
      .setDescription('Who do you want to vouch for?')
      .setRequired(true),
  );

export const handler: KirbotCommandHandler = async (interaction) => {
  const { options, member: invoker, guild } = interaction;

  const tag = logCommandStart(interaction);

  if (!invoker) {
    logger.error(tag, 'How did this command get invoked by a non-member?');
    throw new Error('How did this command get invoked by a non-member?');
  }

  if (!DISCORD_GUILD_VOUCH_ROLE_ID) {
    logger.error(tag, 'No vouch role ID set for this guild');
    throw new Error('No vouch role ID set for this guild');
  }

  const friendUser = options.getUser(Options.Friend, true) as User;
  const friendMember = guild?.members.resolve(friendUser.id);
  const vouchRole = guild?.roles.resolve(DISCORD_GUILD_VOUCH_ROLE_ID);

  if (!vouchRole) {
    logger.error(tag, `Vouch role ID ${DISCORD_GUILD_VOUCH_ROLE_ID} does not exist in this guild`);
    throw new Error(`Vouch role ID ${DISCORD_GUILD_VOUCH_ROLE_ID} does not exist in this guild`);
  }

  if (!friendMember) {
    logger.error(tag, `User ID ${friendUser.id} does not exist in this guild`);
    throw new Error(`User ID ${friendUser.id} does not exist in this guild`);
  }

  const invokerRoleManager = invoker.roles as GuildMemberRoleManager;

  // Require the caller of the command to have the vouch role, otherwise new members can vouch for
  // new members
  if (!invokerRoleManager.cache.has(vouchRole.id)) {
    return interaction.reply(`Hey, get someone to vouch for you first! ${emojiKirybgun}`);
  }

  const friendRoleManager = friendMember.roles as GuildMemberRoleManager;

  if (friendRoleManager.cache.has(vouchRole.id)) {
    return interaction.reply(`That user already has access to the server! ${emojiKirybgun}`);
  }

  // The indicated member does not already have the specified role
  const invokerTag = getMemberTag(invoker);
  const friendMemberTag = getMemberTag(friendMember);
  logger.info(tag, `New member ${friendMemberTag} has been vouched for, adding role`);
  friendRoleManager.add(
    vouchRole,
    `${invokerTag} successfully vouched for ${friendMemberTag}`,
  );

  return interaction.reply(`Welcome aboard, ${friendMember}! ${emojiKirbot}`);
};
