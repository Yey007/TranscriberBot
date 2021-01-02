export type DiscordId = string;
export interface GuildSettings {
    prefix?: string;
}
export interface UserSettings {
    permission?: RecordingPermissionState;
}
export interface TranscriptionPair {
    voiceId: DiscordId;
    textId: DiscordId;
}
export enum RecordingPermissionState {
    Unknown,
    Consent,
    NoConsent
}
