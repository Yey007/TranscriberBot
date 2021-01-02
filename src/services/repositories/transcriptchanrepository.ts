import { DiscordId, TranscriptionPair } from './repotypes';
import { SettingsRepository } from './settingsrepository';

export abstract class TranscriptChanRepository extends SettingsRepository<DiscordId> {
    public abstract getByGuild(guildid: DiscordId): Promise<TranscriptionPair[]>;
    public abstract remove(vcid: DiscordId): Promise<void>;
}
