import { Connection } from 'mysql2/promise';
import { Bot } from './bot';
import { container } from './inversify.config';
import { Logger } from './services/logging/logger';
import { LogOrigin } from './services/logging/logorigin';
import { TYPES } from './types';

export function errorHandlingInit(): void {
    const conn = container.get<Connection>(TYPES.Database);
    const bot = container.get<Bot>(TYPES.Bot);

    conn.on('error', mysqlHandler);
    bot.client.on('error', discordHandler);
}

function mysqlHandler(err) {
    Logger.error(err, LogOrigin.MySQL);
}
function discordHandler(err: Error) {
    Logger.error(err.message, LogOrigin.Discord);
}
