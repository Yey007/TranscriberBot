import { inject, injectable } from "inversify";
import { AbstractPermissionRepository } from "./abstractpermissionrepository";
import { Database } from "sqlite"
import { UserSettings } from "./usersettings";
import { TYPES } from "../../../types";
import SQL from "sql-template-strings";

@injectable()
export class DbPermissionRepository extends AbstractPermissionRepository {

    private db: Database

    public constructor(
        @inject(TYPES.Database) db: Database) 
    {
        super()
        this.db = db
    }

    public async get(userid: string): Promise<UserSettings> {
        let res = await this.db.get("SELECT * FROM user_preferences WHERE id=?", userid)
        return res as UserSettings
    }
    public async set(userid: string, settings: UserSettings): Promise<void> {
        this.db.run(SQL`INSERT INTO user_preferences(id, permission) 
                        VALUES(${userid}, ${settings.permission})
                        ON CONFLICT(id) DO UPDATE SET 
                        permission = IfNull(${settings.permission}, permission) 
                        WHERE id = ${userid};`)
    }
}