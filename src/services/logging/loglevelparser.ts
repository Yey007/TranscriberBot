import { LogLevel } from './loglevel';

export function parseLogLevel(level: string): LogLevel {
    switch (level) {
        case 'DEBUG':
            return LogLevel.Debug;
        case 'VERBOSE':
            return LogLevel.Verbose;
        case 'INFOR':
            return LogLevel.Info;
        case 'WARN':
            return LogLevel.Warn;
        case 'ERROR':
            return LogLevel.Error;
        default:
            return LogLevel.Info;
    }
}
