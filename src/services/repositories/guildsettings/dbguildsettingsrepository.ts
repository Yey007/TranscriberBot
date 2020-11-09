import { inject, injectable } from "inversify";
import { Connection, RowDataPacket } from "mysql2/promise";
import SQL from "sql-template-strings";
import { TYPES } from "../../../types";
import { SettingsRepository } from "../settingsrepository";
import { GuildSettings } from "./guildsettings";

@injectable()
export class DbGuildSettingsRespository extends SettingsRepository<GuildSettings> {

    private db: Connection

    public constructor(
        @inject(TYPES.Database) db: Connection) 
    {
        super()
        this.db = db
    }

    public async get(guildid: string): Promise<GuildSettings> {
        let [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT prefix FROM guild_settings
            WHERE id=${guildid}`)

        if(rows[0])
            return {prefix: rows[0].prefix}
        else
            return {prefix: "!"}
    }
    public async set(guildid: string, settings: GuildSettings): Promise<void> {
        if(guildid === undefined)
            return

        await this.db.query(
            SQL`INSERT INTO guild_settings(id, prefix) 
            VALUES(${guildid}, IFNULL(${settings.prefix}, DEFAULT(prefix))) 
            ON DUPLICATE KEY UPDATE
            prefix = IFNULL(${settings.prefix}, DEFAULT(prefix))`)
    }
}