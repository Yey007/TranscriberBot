import { inject, injectable } from "inversify";
import { Connection, RowDataPacket } from "mysql2/promise";
import SQL from "sql-template-strings";
import { TYPES } from "../../../types";
import { AbstractGuildSettingsRepository } from "./abstractguildsettingsrepository";
import { GuildSettings } from "./guildsettings";

@injectable()
export class DbGuildSettingsRespository extends AbstractGuildSettingsRepository {

    private db: Connection

    public constructor(
        @inject(TYPES.Database) db: Connection) 
    {
        super()
        this.db = db
    }

    public async get(guildid: string): Promise<GuildSettings> {
        let settings: GuildSettings = {}
        settings.transcriptChannels = new Map<string, string>()

        let [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT prefix, voiceId, textId FROM guild_settings 
            LEFT JOIN transcription_channels ON id = guildId
            WHERE id=${guildid}`)

        if(rows[0])
            settings.prefix = rows[0].prefix
        else
            settings.prefix = "!"

        for (const row of rows) {
            settings.transcriptChannels.set(row.voiceId, row.textId)
        }

        return settings
    }
    public async set(guildid: string, settings: GuildSettings): Promise<void> {
        if(guildid === undefined)
            return

        console.log(settings)
        await this.db.query(
            SQL`INSERT INTO guild_settings(id, prefix) 
            VALUES(${guildid}, IFNULL(${settings.prefix}, DEFAULT(prefix))) 
            ON DUPLICATE KEY UPDATE
            prefix = IFNULL(${settings.prefix}, DEFAULT(prefix))`)

        if(settings.transcriptChannels) {
            await this.db.beginTransaction()
            for(let [vcId, tcId] of settings.transcriptChannels) {
                await this.db.query(
                    SQL`REPLACE INTO 
                    transcription_channels(voiceId, textId, guildId)
                    VALUES (${vcId}, ${tcId}, ${guildid})`)
            }
            await this.db.commit()
        }
    }
}