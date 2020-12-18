import migrate from 'db-migrate';
import { container } from './inversify.config';
import { Bot } from './bot';
import { TYPES } from './types';
import { cleanUpInit } from './cleanup';
import { Logger } from './services/logging/logger';
import { LogLevel } from './services/logging/loglevel';
import { LogOrigin } from './services/logging/logorigin';
import { errorHandlingInit } from './errorhandling';

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
    Logger.logLevel = LogLevel.Debug;
    botInit()
        .then(() => {
            Logger.info('Logged in!', LogOrigin.Self);
        })
        .catch((err: Error) => {
            Logger.error(err.message, LogOrigin.Self);
            Logger.error('Failed to log in!', LogOrigin.Self);
        });
}
