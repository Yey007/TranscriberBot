import { injectable } from "inversify";
import { GuildSettings } from "./guildsettings";

@injectable()
export abstract class AbstractGuildSettingsRepository {

    public abstract get(guildid: string, onResult: (settings: GuildSettings) => void): void

    public abstract set(guildid: string, settings: GuildSettings): void
}