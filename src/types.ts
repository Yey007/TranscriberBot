
export const TYPES = {
    Bot: Symbol("Bot"),
    Client: Symbol("Client"),
    Token: Symbol("Token"),

    WatsonAPIKey: Symbol("APIKey"),
    WatsonURL: Symbol("WatsonURL"),
    SpeechToText: Symbol("SpeechToText"),

    Database: Symbol("Database"),

    CommandExecutor: Symbol("CommandExecutor"),
    CommandMapper: Symbol("CommandMapper"),

    Transcriber: Symbol("Transcriber"),
    TranscriptionSender: Symbol("TranscriptionSender"),
    TranscriptionManager: Symbol("TranscriptionManager"),

    StandardEmbedMaker: Symbol("StandardEmbedMaker"),

    PermissionGetter: Symbol("PermissionGetter"),
    PermissionRepository: Symbol("PermissionRepository"),
    GuildSettingsRepository: Symbol("GuildSettingsRepository"),

    ChannelJoiner: Symbol("ChannelJoiner"),
    HelpSender: Symbol("HelpSender"),
    ChannelLeaver: Symbol("ChannelLeaver"),
    SetTranscriptChannel: Symbol("SetTranscriptChannel"),
};