import { inject, injectable } from 'inversify';
import { RecordingPermissionState, UserSettings } from './usersettings';
import { TYPES } from '../../../types';
import SQL from 'sql-template-strings';
import { Connection, RowDataPacket } from 'mysql2/promise';
import { SettingsRepository } from '../settingsrepository';

//TODO: tempSet function for vollatile sets? get checks there first, if set is called key is deleted
@injectable()
export class DbUserSettingsRepository extends SettingsRepository<UserSettings> {
    private db: Connection;

    public constructor(@inject(TYPES.Database) db: Connection) {
        super();
        this.db = db;
    }

    public async get(userid: string): Promise<UserSettings> {
        const [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT permission FROM user_settings 
            WHERE id=${userid}`
        );
        if (rows[0]) return { permission: rows[0].permission };
        else return { permission: RecordingPermissionState.Unknown };
    }
    public async set(userid: string, settings: UserSettings): Promise<void> {
        if (userid === undefined) return;

        await this.db.query(
            SQL`INSERT INTO user_settings(id, permission) 
            VALUES(${userid}, IFNULL(${settings.permission}, DEFAULT(permission)))
            ON DUPLICATE KEY UPDATE
            permission = IFNULL(${settings.permission}, permission)`
        );
    }
}
