import { injectable } from "inversify";

@injectable()
export abstract class AbstractPermissionRepository {

    public abstract get(userid: string, onResult: (state: PermissionState) => void): void

    public abstract set(userid: string, state: PermissionState): void
}

export enum PermissionState {
    Unknown,
    Consent,
    NoConsent,
}