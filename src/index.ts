import 'reflect-metadata';
import { Bot } from './bot';
import { cleanUpInit } from './initialization/cleanup';
import { Logger } from './services/logging/logger';
import { LogOrigin } from './services/logging/logorigin';
import { errorHandlingInit } from './initialization/errorhandling';
import { parseLogLevel } from './services/logging/loglevelparser';
import { createConnection } from 'typeorm';
import Container from 'typedi';
import { containerInit } from './initialization/container';
import { loadEnv } from './initialization/env';
import { dbInit } from './initialization/db';

export let bot: Bot;

export async function botInit(): Promise<void> {
    loadEnv();
    Logger.logLevel = parseLogLevel(process.env.LOG_LEVEL);
    containerInit();
    await dbInit();
    errorHandlingInit();
    cleanUpInit();
    bot = Container.get(Bot);
    await bot.start();
}

if (require.main === module) {
    botInit()
        .then(() => {
            Logger.info('Logged in!', LogOrigin.Self);
        })
        .catch((err: Error) => {
            Logger.error(err.message, LogOrigin.Self);
            Logger.error('Failed to log in!', LogOrigin.Self);
        });
}
