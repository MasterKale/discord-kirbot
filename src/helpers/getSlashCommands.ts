import fs from 'node:fs';
import path from 'node:path';

import { KirbotCommandConfig, KirbotCommandHandler } from './constants';

/**
 * Go through the **slashCommands/** folder and retrieve all available commands
 */
export function getSlashCommands (): [KirbotCommandConfig, KirbotCommandHandler][] {
  const commandFileExtension = /^([^.].*)\.[jt]s$/;
  const commandsPath = path.join(__dirname, '../slashCommands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => commandFileExtension.test(file));

  const toReturn: [KirbotCommandConfig, KirbotCommandHandler][] = commandFiles.map((filename) => {
    const filePath = path.join(commandsPath, filename);
    const { config, handler } = require(filePath);

    return [
      (config as KirbotCommandConfig),
      (handler as KirbotCommandHandler),
    ];
  });

  return toReturn;
}
