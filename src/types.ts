import { ChannelJoiner } from "./services/commands/join";

export const TYPES = {
    Bot: Symbol("Bot"),

    Client: Symbol("Client"),
    Token: Symbol("Token"),

    WatsonAPIKey: Symbol("APIKey"),
    WatsonURL: Symbol("WatsonURL"),
    SpeechToText: Symbol("SpeechToText"),

    CommandExecutor: Symbol("CommandExecutor"),
    Transcriber: Symbol("Transcriber"),
    TranscriptionSender: Symbol("TranscriptionSender"),
    ConsentGetter: Symbol("ConsentGetter"),
    StandardEmbedMaker: Symbol("StandardEmbedMaker"),
    CommandMapper: Symbol("CommandMapper"),
    TranscriptionManager: Symbol("TranscriptionManager"),

    ChannelJoiner: Symbol("ChannelJoiner"),
    HelpSender: Symbol("HelpSender"),
    ChannelLeaver: Symbol("ChannelLeaver"),
};