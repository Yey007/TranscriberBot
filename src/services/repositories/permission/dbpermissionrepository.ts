import { inject, injectable } from "inversify";
import { AbstractPermissionRepository } from "./abstractpermissionrepository";
import { RecordingPermissionState, UserSettings } from "./usersettings";
import { TYPES } from "../../../types";
import SQL from "sql-template-strings";
import { Connection, RowDataPacket } from "mysql2/promise";

@injectable()
export class DbPermissionRepository extends AbstractPermissionRepository {

    private db: Connection

    public constructor(
        @inject(TYPES.Database) db: Connection) 
    {
        super()
        this.db = db
    }

    //TODO: Convert to mysql
    public async get(userid: string): Promise<UserSettings> {
        let settings: UserSettings = {}
        let [rows] = await this.db.query<RowDataPacket[]>(SQL`SELECT permission FROM user_settings WHERE id=${userid} LIMIT 1;`)
        if(rows[0]) 
            settings.permission = rows[0].permission   
        else
            settings.permission = RecordingPermissionState.Unknown
        return settings 
    }
    public async set(userid: string, settings: UserSettings): Promise<void> {
        await this.db.query(
            SQL`INSERT INTO user_settings(id, permission) 
            VALUES(${userid}, ${settings.permission})
            ON DUPLICATE KEY UPDATE
            permission = IFNULL(${settings.permission}, permission)`)
    }
}