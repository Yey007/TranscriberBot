import { ChannelJoiner } from "./services/commands/join";

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

    ChannelJoiner: Symbol("ChannelJoiner"),
    HelpSender: Symbol("HelpSender")
};