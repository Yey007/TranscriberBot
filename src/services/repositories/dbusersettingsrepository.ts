import { inject, injectable } from 'inversify';
import { DiscordId, RecordingPermissionState, UserSettings } from './repotypes';
import { TYPES } from '../../types';
import SQL from 'sql-template-strings';
import { Connection, RowDataPacket } from 'mysql2/promise';
import { SettingsRepository } from './settingsrepository';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';

//TODO: tempSet function for vollatile sets? get checks there first, if set is called key is deleted
@injectable()
export class DbUserSettingsRepository extends SettingsRepository<UserSettings> {
    private db: Connection;

    public constructor(@inject(TYPES.Database) db: Connection) {
        super();
        this.db = db;
    }

    public async get(userid: DiscordId): Promise<UserSettings> {
        const [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT permission FROM user_settings 
            WHERE id=${userid}`
        );

        Logger.verbose(
            `Retreived user settings for user with id ${userid}. The retrieved settings are ${rows[0]}`,
            LogOrigin.MySQL
        );

        if (rows[0]) return { permission: rows[0].permission };
        else return { permission: RecordingPermissionState.Unknown };
    }
    public async set(userid: DiscordId, settings: UserSettings): Promise<void> {
        if (userid === undefined) return;

        await this.db.query(
            SQL`INSERT INTO user_settings(id, permission) 
            VALUES(${userid}, IFNULL(${settings.permission}, DEFAULT(permission)))
            ON DUPLICATE KEY UPDATE
            permission = IFNULL(${settings.permission}, permission)`
        );
        Logger.verbose(
            `Created or updated user settings for user with id ${userid}. The new settings are ${settings}`,
            LogOrigin.MySQL
        );
    }
}
