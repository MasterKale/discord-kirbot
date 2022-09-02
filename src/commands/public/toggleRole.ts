// /* eslint-disable camelcase */
// import { CommandoClient, CommandoMessage } from 'discord.js-commando';
// import { oneLine, stripIndents } from 'common-tags';
// import Fuse from 'fuse.js';

// import KirbotCommand from '../../helpers/KirbotCommand';
// import { CMD_GROUPS, CMD_NAMES, API_ERROR } from '../../helpers/constants';
// import { logger, getLogTag } from '../../helpers/logger';
// import logCommandStart from '../../helpers/logCommandStart';

// interface RoleArgs {
//   roleName: string;
// }

// export default class SetDescriptionCommand extends KirbotCommand {
//   constructor (client: CommandoClient) {
//     super(client, {
//       name: CMD_NAMES.PUBLIC_TOGGLE_ROLE,
//       group: CMD_GROUPS.PUBLIC,
//       memberName: 'toggle_role',
//       description: 'Toggle a server role on yourself',
//       details: stripIndents`
//         The rules for toggling are straight-forward:

//         - If you specify the name of a role you __don't__ have, the role will be __added__ to you
//         - If you specify the name of a role you __do__ have, the role will be __removed__ from you

//         ${oneLine`
//           If a role can't be toggled, it's probably because the role would grant you more
//           permissions than you currently have. This bot's pretty capable, but not _that_
//           capable :wink:
//         `}

//         _In memory of BroBot (2016 - 2019)_ :robot:
//       `,
//       guildOnly: true,
//       examples: [
//         `${CMD_NAMES.PUBLIC_TOGGLE_ROLE} LLJK`,
//         `${CMD_NAMES.PUBLIC_TOGGLE_ROLE} Pusher Bot`,
//       ],
//       args: [
//         {
//           key: 'roleName',
//           type: 'string',
//           prompt: 'which role are you interested in?',
//         },
//       ],
//     });
//   }

//   async run (message: CommandoMessage, { roleName }: RoleArgs) {
//     const { id, member } = message;

//     const tag = getLogTag(id);

//     logCommandStart(tag, message);

//     logger.info(tag, `Validating role name "${roleName}"`);

//     const toFind = `${roleName.toLowerCase()}`;

//     message.channel.startTyping();

//     // Set up a Fuse so we can fuzzy search across role names
//     const rolesFuse = new Fuse(message.guild.roles.cache.array(), {
//       keys: ['name'],
//     });
//     const role = rolesFuse.search(toFind)[0];

//     if (!role) {
//       message.channel.stopTyping();
//       return message.reply(oneLine`
//         \`${toFind}\` doesn't appear to be a valid role. Try again.
//       `);
//     }

//     logger.info(tag, `Found matching role "${role.name}" (${role.id})`);

//     logger.info(
//       tag,
//       oneLine`
//         Toggling role "${role.name}" on ${member.user.tag} (${member.id})
//       `,
//     );

//     const hasRole = member.roles.cache.has(role.id);

//     message.channel.stopTyping();

//     try {
//       let reply;
//       if (hasRole) {
//         logger.info(tag, 'Member has role, removing role');
//         await member.roles.remove(role, 'Toggled role off');
//         reply = `you no longer have the **${role.name}** role`;
//       } else {
//         logger.info(tag, 'Member does not have role, adding role');
//         await member.roles.add(role, 'Toggled role on');
//         reply = `you now have the **${role.name}** role`;
//       }

//       return message.reply(reply);
//     } catch (err) {
//       if (err.code === API_ERROR.MISSING_PERMISSIONS) {
//         logger.info(tag, 'User tried to toggle a role above them');
//         return message.reply('that role cannot be toggled, please try again.');
//       } else {
//         logger.info({ ...tag, err }, 'Error toggling role');
//         throw err;
//       }
//     }
//   }
// }
