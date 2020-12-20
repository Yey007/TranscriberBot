import { Bot } from './bot';
import { container } from './inversify.config';
import { Logger } from './services/logging/logger';
import { LogOrigin } from './services/logging/logorigin';
import { TYPES } from './types';

export function cleanUpInit(): void {
    const killSignals = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'];
    killSignals.forEach((eventType) => {
        process.on(eventType, cleanUp.bind(null, eventType));
    });
}

function cleanUp(eventType) {
    Logger.info('Recieved ' + eventType, LogOrigin.Self);
    Logger.info('Stopping bot...', LogOrigin.Self);
    const bot = container.get<Bot>(TYPES.Bot);
    bot.stop();
}
