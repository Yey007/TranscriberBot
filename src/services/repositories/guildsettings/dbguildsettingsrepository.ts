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
        let res: GuildSettings = {}
        res.transcriptChannels = new Map<string, string>()
        let first = true
        await this.db.each(
            SQL`SELECT * FROM guild_settings 
            JOIN transcription_channels ON id = guildid
            WHERE id=${guildid};`, function (err, row) {
            if(err === undefined || err === null) {
                if (first) {
                    if(row.prefix === null) {
                        res.prefix = "!"
                    } else {
                        res.prefix = row.prefix
                    }
                    first = false
                }
                res.transcriptChannels.set(row.voiceChannelId, row.transcriptChannelId)
            }
        })
        return res
    }
    public async set(guildid: string, settings: GuildSettings): Promise<void> {

        //TODO: Update query to handle multiple transcription channels
        if(guildid === undefined)
            return
        await this.db.run(SQL`INSERT INTO guild_settings(id, prefix) 
                    VALUES(${guildid}, ${settings.prefix}) 
                    ON CONFLICT(id) DO UPDATE SET
                    prefix = IfNull(${settings.prefix}, prefix)
                    WHERE id = ${guildid}`)
        await this.db.run(SQL`BEGIN TRANSACTION;`)
        for(let [vcId, tcId] of settings.transcriptChannels) {
            await this.db.run(SQL`INSERT OR REPLACE INTO 
                            transcription_channels(voiceChannelId, guildId, transcriptChannelId)
                            VALUES (${vcId}, ${guildid},${tcId})`)
        }
        await this.db.run(SQL`COMMIT;`)
    }
}