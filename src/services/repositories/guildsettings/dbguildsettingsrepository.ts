import { inject, injectable } from "inversify";
import SQL from "sql-template-strings";
import { Database } from "sqlite";
import { TYPES } from "../../../types";
import { AbstractGuildSettingsRepository } from "./abstractguildsettingsrepository";
import { GuildSettings } from "./guildsettings";

@injectable()
export class DbGuildSettingsRespository extends AbstractGuildSettingsRepository {

    private db: Database

    public constructor(
        @inject(TYPES.Database) db: Database) 
    {
        super()
        this.db = db
    }

    public async get(guildid: string): Promise<GuildSettings> {
        let res = await this.db.get(SQL`SELECT * FROM guild_settings WHERE id=${guildid}`)
        return res as GuildSettings //As long as GuildSettings represents the data in the database, this should be fine.
    }
    public async set(guildid: string, settings: GuildSettings): Promise<void> {
        console.log(guildid)
        console.log(settings)
        this.db.run(SQL`INSERT INTO guild_settings(id, transcriptChannelId, prefix) 
                    VALUES(${guildid}, ${settings.transcriptChannelId}, ${settings.prefix}) 
                    ON CONFLICT(id) DO UPDATE SET
                    transcriptChannelId = IfNull(${settings.transcriptChannelId}, transcriptChannelId),
                    prefix = IfNull(${settings.prefix}, prefix)
                    WHERE id = ${guildid};`)
    }
}