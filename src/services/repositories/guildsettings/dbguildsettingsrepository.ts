import { inject, injectable } from "inversify";
import { Database } from "sqlite3";
import { TYPES } from "../../../types";
import { AbstractGuildSettingsRepository } from "./abstractguildsettingsrepository";
import { GuildSettings } from "./guildsettings";

@injectable()
export class DbGuildSettingsRespoitory extends AbstractGuildSettingsRepository {

    private db: Database

    public constructor(
        @inject(TYPES.Database) db: Database) 
    {
        super()
        this.db = db
    }

    public get(guildid: string, onResult: (settings: GuildSettings) => void): void {
        this.db.get("SELECT transcriptChannelId FROM guild_preferences WHERE id=?", guildid, (err, row) => {
            if(row === undefined) {
                onResult(undefined)
                return
            }
            onResult({transcriptionChannelId: row.transcriptChannelId})
        })
    }
    
    public set(guildid: string, settings: GuildSettings): void {
        this.db.serialize(() => {   
            var stmt = this.db.prepare("INSERT OR REPLACE INTO guild_preferences(id, transcriptChannelId) VALUES(?, ?)")
            stmt.run(guildid, settings.transcriptionChannelId)
            stmt.finalize()
        })
    }

}