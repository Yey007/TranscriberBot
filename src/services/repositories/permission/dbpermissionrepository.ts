import { inject, injectable } from "inversify";
import { AbstractPermissionRepository } from "./abstractpermissionrepository";
import { UserSettings } from "./usersettings";
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
        let [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT IFNULL(permission, DEFAULT(permission)) AS permission 
            FROM user_settings WHERE id=${userid} LIMIT 1;`)
        if(rows[0] === undefined) {
            return {}
        }
        return rows[0] as UserSettings
    }
    public async set(userid: string, settings: UserSettings): Promise<void> {
        await this.db.query(
            SQL`INSERT INTO user_settings(id, permission) 
            VALUES(${userid}, ${settings.permission})
            ON DUPLICATE KEY UPDATE
            permission = IFNULL(${settings.permission}, permission)`)
    }
}