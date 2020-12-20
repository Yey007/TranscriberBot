import { LogLevel } from './loglevel';

export function parseLogLevel(level: string): LogLevel {
    switch (level) {
        case 'DEBUG':
            return LogLevel.Debug;
        case 'VERBOSE':
            return LogLevel.Verbose;
        case 'Info':
            return LogLevel.Info;
        case 'Warn':
            return LogLevel.Warn;
        case 'Error':
            return LogLevel.Error;
        default:
            return LogLevel.Info;
    }
}
