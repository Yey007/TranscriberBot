import migrate from 'db-migrate';
import { container } from './inversify.config';
import { Bot } from './bot';
import { TYPES } from './types';
import { cleanUpInit } from './cleanup';
import { Logger } from './services/logging/logger';
import { LogOrigin } from './services/logging/logorigin';
import { errorHandlingInit } from './errorhandling';
import { parseLogLevel } from './services/logging/loglevelparser';

export const bot: Bot = container.get<Bot>(TYPES.Bot);

export async function botInit(): Promise<void> {
    errorHandlingInit();
    cleanUpInit();
    const dbm = migrate.getInstance(true);
    await dbm.up().catch((err) => {
        Logger.error(err, LogOrigin.MySQL);
    });
    await bot.start().catch((err: Error) => {
        Logger.error(err.message, LogOrigin.Discord);
    });
}

if (require.main === module) {
    //TODO: Load from env
    Logger.logLevel = parseLogLevel(process.env.LOG_LEVEL);
    botInit()
        .then(() => {
            Logger.info('Logged in!', LogOrigin.Self);
        })
        .catch((err: Error) => {
            Logger.error(err.message, LogOrigin.Self);
            Logger.error('Failed to log in!', LogOrigin.Self);
        });
}
