import { injectable } from "inversify";
import { RecordingPermissionState } from "./permissionstate";

@injectable()
export abstract class AbstractPermissionRepository {

    public abstract get(userid: string, onResult: (state: RecordingPermissionState) => void): void

    public abstract set(userid: string, state: RecordingPermissionState): void
}