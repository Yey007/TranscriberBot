import { LogColor } from './logcolor';
import { LogLevel } from './loglevel';
import { LogOrigin } from './logorigin';

export class Logger {
    public static logLevel = LogLevel.Info;
    private static dateTimeFormat = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    public static debug(message: unknown, origin: LogOrigin = LogOrigin.Self): void {
        if (this.logLevel <= LogLevel.Debug) {
            console.log(
                LogColor.magenta(`[DEBUG] [${origin}] ${message} at ${this.dateTimeFormat.format(Date.now())}`)
            );
        }
    }
    public static verbose(message: string, origin: LogOrigin = LogOrigin.Self): void {
        if (this.logLevel <= LogLevel.Verbose) {
            console.log(LogColor.blue(`[VERBOSE] [${origin}] ${message} at ${this.dateTimeFormat.format(Date.now())}`));
        }
    }
    public static info(message: unknown, origin: LogOrigin = LogOrigin.Self): void {
        if (this.logLevel <= LogLevel.Info) {
            console.log(LogColor.white(`[INFO] [${origin}] ${message} at ${this.dateTimeFormat.format(Date.now())}`));
        }
    }
    public static warn(message: unknown, origin: LogOrigin = LogOrigin.Self): void {
        if (this.logLevel <= LogLevel.Warn) {
            console.log(LogColor.yellow(`[WARN] [${origin}] ${message} at ${this.dateTimeFormat.format(Date.now())}`));
        }
    }
    public static error(message: unknown, origin: LogOrigin = LogOrigin.Self): void {
        if (this.logLevel <= LogLevel.Error) {
            console.log(LogColor.red(`[ERROR] [${origin}] ${message} at ${this.dateTimeFormat.format(Date.now())}`));
        }
    }
}
