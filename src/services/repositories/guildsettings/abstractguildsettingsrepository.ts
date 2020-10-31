import { injectable } from "inversify";
import { GuildSettings } from "./guildsettings";

@injectable()
export abstract class AbstractGuildSettingsRepository {
    public abstract get(guildid: string): Promise<GuildSettings>
    public abstract set(guildid: string, settings: GuildSettings): Promise<void>
}