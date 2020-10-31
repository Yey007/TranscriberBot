import { inject, injectable } from "inversify";
import { AbstractPermissionRepository } from "./abstractpermissionrepository";
import { Database } from "sqlite"
import { RecordingPermissionState, UserSettings } from "./usersettings";
import { TYPES } from "../../../types";

@injectable()
export class DbPermissionRepository extends AbstractPermissionRepository {

    private db: Database

    public constructor(
        @inject(TYPES.Database) db: Database) 
    {
        super()
        this.db = db
    }

    //FIXME: Usesome sort of update statement to prvenet dataraces
    //FIXME: handle undefined res
    public async get(userid: string): Promise<UserSettings> {
        let res = await this.db.get("SELECT * FROM user_preferences WHERE id=?", userid)
        let settings: UserSettings = { recPermState: res.permission }
        return settings
    }
    public async set(userid: string, settings: UserSettings): Promise<void> {
        this.db.run("INSERT OR REPLACE INTO user_preferences(id, permission) VALUES(?, ?)", 
            userid, settings.recPermState)
    }
}