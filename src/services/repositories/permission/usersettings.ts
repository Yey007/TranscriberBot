export interface UserSettings {
   recPermState: RecordingPermissionState 
}

export enum RecordingPermissionState {
    Unknown,
    Consent,
    NoConsent,
}