import dotenv from 'dotenv';
import {
  ChatInputCommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

import { LogTag } from './logger';

dotenv.config();

export const {
  NODE_ENV = 'production',
  DISCORD_BOT_TOKEN,
  DISCORD_BOT_APPLICATION_ID,
  DISCORD_BOT_GUILD_ID,
  DISCORD_GUILD_VOUCH_ROLE_ID, // Miis role in Nintengoons
  PAPERTRAIL_HOST,
  PAPERTRAIL_PORT,
} = process.env;

export enum CMD_GROUPS {
  PUBLIC = 'public',
}

export const kirbotCommandNames = ['toggle-role', 'friend-code', 'vouch'] as const;
export type KirbotCommandName = typeof kirbotCommandNames[number];

export type KirbotCommandConfig =
  Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  | SlashCommandSubcommandsOnlyBuilder;
export type KirbotCommandHandler = (interaction: ChatInputCommandInteraction) =>
  Promise<InteractionResponse<boolean>>;
export type KirbotSubCommandHandler = (tag: LogTag, interaction: ChatInputCommandInteraction) =>
Promise<InteractionResponse<boolean>>;

/**
 * Discord API error codes
 *
 * Pulled from here: https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#json
 */
export enum API_ERROR {
  UNKNOWN_ACCOUNT = 10001,
  UNKNOWN_APPLICATION = 10002,
  UNKNOWN_CHANNEL = 10003,
  UNKNOWN_GUILD = 10004,
  UNKNOWN_INTEGRATION = 10005,
  UNKNOWN_INVITE = 10006,
  UNKNOWN_MEMBER = 10007,
  UNKNOWN_MESSAGE = 10008,
  UNKNOWN_OVERWRITE = 10009,
  UNKNOWN_PROVIDER = 10010,
  UNKNOWN_ROLE = 10011,
  UNKNOWN_TOKEN = 10012,
  UNKNOWN_USER = 10013,
  UNKNOWN_EMOJI = 10014,
  UNKNOWN_WEBHOOK = 10015,
  BOT_PROHIBITED_ENDPOINT = 20001,
  BOT_ONLY_ENDPOINT = 20002,
  MAXIMUM_GUILDS = 30001,
  MAXIMUM_FRIENDS = 30002,
  MAXIMUM_PINS = 30003,
  MAXIMUM_ROLES = 30005,
  MAXIMUM_REACTIONS = 30010,
  MAXIMUM_CHANNELS = 30013,
  MAXIMUM_INVITES = 30016,
  UNAUTHORIZED = 40001,
  USER_BANNED = 40007,
  MISSING_ACCESS = 50001,
  INVALID_ACCOUNT_TYPE = 50002,
  CANNOT_EXECUTE_ON_DM = 50003,
  EMBED_DISABLED = 50004,
  CANNOT_EDIT_MESSAGE_BY_OTHER = 50005,
  CANNOT_SEND_EMPTY_MESSAGE = 50006,
  CANNOT_MESSAGE_USER = 50007,
  CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL = 50008,
  CHANNEL_VERIFICATION_LEVEL_TOO_HIGH = 50009,
  OAUTH2_APPLICATION_BOT_ABSENT = 50010,
  MAXIMUM_OAUTH2_APPLICATIONS = 50011,
  INVALID_OAUTH_STATE = 50012,
  MISSING_PERMISSIONS = 50013,
  INVALID_AUTHENTICATION_TOKEN = 50014,
  NOTE_TOO_LONG = 50015,
  INVALID_BULK_DELETE_QUANTITY = 50016,
  CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL = 50019,
  INVALID_OR_TAKEN_INVITE_CODE = 50020,
  CANNOT_EXECUTE_ON_SYSTEM_MESSAGE = 50021,
  INVALID_OAUTH_TOKEN = 50025,
  BULK_DELETE_MESSAGE_TOO_OLD = 50034,
  INVALID_FORM_BODY = 50035,
  INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT = 50036,
  INVALID_API_VERSION = 50041,
  REACTION_BLOCKED = 90001,
  RESOURCE_OVERLOADED = 130000,
}

// API errors above that can be safely handled with a cancellation
export const recoverableErrors = [
  API_ERROR.MISSING_PERMISSIONS,
  API_ERROR.UNKNOWN_ROLE,
];
