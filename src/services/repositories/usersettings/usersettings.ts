export interface UserSettings {
    permission?: RecordingPermissionState;
}

export enum RecordingPermissionState {
    Unknown,
    Consent,
    NoConsent
}
