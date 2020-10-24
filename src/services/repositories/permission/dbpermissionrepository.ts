import { injectable } from "inversify";
import { AbstractPermissionRepository, PermissionState } from "./abstractpermissionrepository";
import { Database } from "sqlite3"

@injectable()
export class DbPermissionRepository extends AbstractPermissionRepository {

    private db: Database

    public constructor() {
        super()
        this.db = new Database("resources/bot.db")
    }

    public get(userid: string, onResult: (state: PermissionState) => void): void {

        this.db.get("SELECT permission FROM user_preferences WHERE id=?", userid, (err, row) => {
            if (row === undefined) {
                onResult(PermissionState.Unknown)
                return
            }
            switch (row.permission) {
                case 1:
                    onResult(PermissionState.Consent)
                    break
                case 2:
                    onResult(PermissionState.NoConsent)
                    break
                default:
                    onResult(PermissionState.Unknown)
                    break
            }
        })

    }

    public set(userid: string, state: PermissionState): void {       
        this.db.serialize(() => {   
            var stmt = this.db.prepare("INSERT OR REPLACE INTO user_preferences(id, permission) VALUES(?, ?)")
            stmt.run(userid, state)
            stmt.finalize()
        })
    }

}