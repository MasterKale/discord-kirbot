/* eslint-disable camelcase */
import pino from 'pino';
import { SnowflakeUtil } from 'discord.js';

import { NODE_ENV } from './constants';

export interface LogTag {
  // eslint-disable-next-line camelcase
  req_id: string;
}

let mixin;
if (NODE_ENV === 'production') {
  mixin = () => ({ hostname: 'prod-kirbot' });
}

export const logger = pino({
  level: 'debug',
  mixin,
});

/**
 * A helper method to generate an object that can be used to tag logged messages generated from
 * a singular "request". This will help with troubleshooting sequences events by allowing for
 * filtering on this particular, consistent ID.
 */
export function getLogTag (id?: string): LogTag {
  let req_id;

  if (id) {
    // If an ID is provided then use that
    req_id = id;
  } else {
    // Otherwise generate a snowflake as an ID
    // See https://discordapp.com/developers/docs/reference#snowflakes
    req_id = `${SnowflakeUtil.generate()}`;
  }

  return { req_id };
}
