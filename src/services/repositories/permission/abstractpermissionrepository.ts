import { injectable } from "inversify";

@injectable()
export abstract class AbstractPermissionRepository {

    public abstract get(userid: string): PermissionState

    public abstract set(userid: string, state: PermissionState): void
}

export enum PermissionState {
    Consent,
    NoConsent,
    Unknown,
}