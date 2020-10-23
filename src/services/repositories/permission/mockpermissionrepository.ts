import { injectable } from "inversify"
import { AbstractPermissionRepository, PermissionState } from "./abstractpermissionrepository"

@injectable()
export class MockPermissionRepository extends AbstractPermissionRepository {

    //User id to state
    private consentMap: Map<string, PermissionState>

    public constructor() {
        super()
        this.consentMap = new Map()
    }

    public get(userid: string): PermissionState {
        let state = this.consentMap.get(userid)
        if (state === undefined) {
            return PermissionState.Unknown
        }
        return state
    }

    public set(userid: string, state: PermissionState) {
        this.consentMap.set(userid, state)
    } 
}