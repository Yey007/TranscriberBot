import dotenv from 'dotenv';

export function loadEnv(): void {
    if (process.env.CONTAINER !== 'TRUE') {
        dotenv.config({ path: 'bot.env' });
        dotenv.config({ path: 'db.env' });
    }
}
