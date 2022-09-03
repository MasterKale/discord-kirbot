import { APIInteractionGuildMember, GuildMember } from 'discord.js';

/**
 * Take a GuildMember and return their "tag" (e.g. "IAmKale#0023")
 */
export function getMemberTag (member: GuildMember | APIInteractionGuildMember): string {
  return `${member.user.username}#${member.user.discriminator}`;
}
