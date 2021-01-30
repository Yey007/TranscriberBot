import Container from 'typedi';
import { Bot } from '../bot';
import { Logger } from '../services/logging/logger';
import { LogOrigin } from '../services/logging/logorigin';

export function errorHandlingInit(): void {
    const bot = Container.get(Bot);
    bot.client.on('error', discordHandler);
}

function discordHandler(err: Error) {
    Logger.error(err.message, LogOrigin.Discord);
}
