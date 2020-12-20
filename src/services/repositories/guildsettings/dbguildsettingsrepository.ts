import { inject, injectable } from 'inversify';
import { Connection, RowDataPacket } from 'mysql2/promise';
import SQL from 'sql-template-strings';
import { TYPES } from '../../../types';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { SettingsRepository } from '../settingsrepository';
import { GuildSettings } from './guildsettings';

@injectable()
export class DbGuildSettingsRespository extends SettingsRepository<GuildSettings> {
    private db: Connection;

    public constructor(@inject(TYPES.Database) db: Connection) {
        super();
        this.db = db;
    }

    public async get(guildid: string): Promise<GuildSettings> {
        const [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT prefix FROM guild_settings
            WHERE id=${guildid}`
        );

        Logger.verbose(
            `Retrieved guild settings for guild with id ${guildid}. The retrieved settings are ${rows[0]}`,
            LogOrigin.MySQL
        );

        //TODO: Convert to that questionmark dot thing
        if (rows[0]) return { prefix: rows[0].prefix };
        else return { prefix: '!' };
    }
    public async set(guildid: string, settings: GuildSettings): Promise<void> {
        if (guildid === undefined) return;

        await this.db.query(
            SQL`INSERT INTO guild_settings(id, prefix) 
            VALUES(${guildid}, IFNULL(${settings.prefix}, DEFAULT(prefix))) 
            ON DUPLICATE KEY UPDATE
            prefix = IFNULL(${settings.prefix}, prefix)`
        );
        Logger.verbose(
            `Created or updated guild settings for guild with id ${guildid}. The new settings are ${settings}`,
            LogOrigin.MySQL
        );
    }
}
