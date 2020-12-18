export class LogColor {
    public static magenta(message: string): string {
        return '\x1b[35m' + message + '\x1b[0m';
    }
    public static blue(message: string): string {
        return '\x1b[34m' + message + '\x1b[0m';
    }
    public static white(message: string): string {
        return '\x1b[97m' + message + '\x1b[0m';
    }
    public static red(message: string): string {
        return '\x1b[31m' + message + '\x1b[0m';
    }
    public static yellow(message: string): string {
        return '\x1b[93m' + message + '\x1b[0m';
    }
}
