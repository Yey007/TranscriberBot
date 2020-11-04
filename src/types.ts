
export const TYPES = {
    Bot: Symbol("Bot"),
    Client: Symbol("Client"),
    Token: Symbol("Token"),

    WatsonAPIKey: Symbol("APIKey"),
    WatsonURL: Symbol("WatsonURL"),
    SpeechToText: Symbol("SpeechToText"),

    CommandExecutor: Symbol("CommandExecutor"),
    CommandMapper: Symbol("CommandMapper"),

    Transcriber: Symbol("Transcriber"),
    TranscriptionSender: Symbol("TranscriptionSender"),
    TranscriptionManager: Symbol("TranscriptionManager"),
    PermissionGetter: Symbol("PermissionGetter"),
    TranscriptionChannelGetter: Symbol("TranscriptionChannelGetter"),

    StandardEmbedMaker: Symbol("StandardEmbedMaker"),

    Database: Symbol("Database"),
    PermissionRepository: Symbol("PermissionRepository"),
    GuildSettingsRepository: Symbol("GuildSettingsRepository"),

    ChannelJoiner: Symbol("ChannelJoiner"),
    About: Symbol("About"),
    ChannelLeaver: Symbol("ChannelLeaver"),
    SetTranscriptChannel: Symbol("SetTranscriptChannel"),
    SetRecordingPermission: Symbol("SetRecordingPermission"),
    Help: Symbol("Help"),
    SetPrefix: Symbol("SetPrefix")
};