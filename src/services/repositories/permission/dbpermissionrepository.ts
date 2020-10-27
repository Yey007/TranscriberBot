import { inject, injectable } from "inversify";
import { AbstractPermissionRepository } from "./abstractpermissionrepository";
import { Database } from "sqlite3"
import { RecordingPermissionState } from "./permissionstate";
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

    public get(userid: string, onResult: (state: RecordingPermissionState) => void): void {

        this.db.get("SELECT permission FROM user_preferences WHERE id=?", userid, (err, row) => {
            if (row === undefined) {
                onResult(RecordingPermissionState.Unknown)
                return
            }
            switch (row.permission) {
                case 1:
                    onResult(RecordingPermissionState.Consent)
                    break
                case 2:
                    onResult(RecordingPermissionState.NoConsent)
                    break
                default:
                    onResult(RecordingPermissionState.Unknown)
                    break
            }
        })

    }

    public set(userid: string, state: RecordingPermissionState): void {       
        this.db.serialize(() => {   
            var stmt = this.db.prepare("INSERT OR REPLACE INTO user_preferences(id, permission) VALUES(?, ?)")
            stmt.run(userid, state)
            stmt.finalize()
        })
    }

}