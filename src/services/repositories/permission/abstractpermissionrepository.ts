import { injectable } from "inversify";
import { UserSettings } from "./usersettings";

@injectable()
export abstract class AbstractPermissionRepository {

    public abstract get(userid: string): Promise<UserSettings>

    public abstract set(userid: string, state: UserSettings): Promise<void>
}