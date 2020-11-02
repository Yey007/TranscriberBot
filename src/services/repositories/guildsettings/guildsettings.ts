export interface GuildSettings {
    transcriptChannelId?: string
    prefix?: string //This is guaranteed to be there on a get, but doesn't have to be there on a set. Therefore, it is optional.
}