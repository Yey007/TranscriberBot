import Container from 'typedi';
import { Bot } from '../bot';
import { Logger } from '../services/logging/logger';
import { LogOrigin } from '../services/logging/logorigin';

export function cleanUpInit(): void {
    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));

    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

function exitHandler(options: { cleanup?: boolean; exit?: boolean }) {
    if (options.cleanup) {
        Logger.info('Stopping bot...', LogOrigin.Self);
        const bot = Container.get(Bot);
        bot.stop();
    }
    if (options.exit) process.exit();
}
