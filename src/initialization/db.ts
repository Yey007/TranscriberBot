import { createConnection } from 'typeorm';

export async function dbInit(): Promise<void> {
    if (process.env.CONTAINER === 'true') {
        await createConnection({
            name: 'default',
            type: 'mysql',
            host: 'db',
            port: 3306,
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            synchronize: true,
            logging: false,
            entities: ['src/entity/**/*.ts'],
            migrations: ['src/migration/**/*.ts'],
            subscribers: ['src/subscriber/**/*.ts']
        });
    } else {
        await createConnection({
            name: 'default',
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'hello',
            database: 'transcriberbot',
            synchronize: true,
            logging: false,
            entities: ['src/entity/**/*.ts'],
            migrations: ['src/migration/**/*.ts'],
            subscribers: ['src/subscriber/**/*.ts']
        });
    }
}
