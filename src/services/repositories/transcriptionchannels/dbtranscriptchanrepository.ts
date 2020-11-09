import { inject, injectable } from "inversify";
import { Connection, RowDataPacket } from "mysql2/promise";
import SQL from "sql-template-strings";
import { TYPES } from "../../../types";
import { SettingsRepository } from "../settingsrepository";

@injectable()
export class DbTranscriptChanRepository extends SettingsRepository<string> {
    
    private db: Connection

    public constructor(
        @inject(TYPES.Database) db: Connection) 
    {
        super()
        this.db = db
    }

    public async get(vcid: string): Promise<string> {
        let [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT textId FROM transcription_channels
            WHERE voiceId=${vcid}`)
        if(rows[0])
            return rows[0].textId
        else
            return null
    }
    public async set(vcid: string, tcid: string): Promise<void> {
        await this.db.query(
            SQL`REPLACE INTO transcription_channels(voiceId, textId)
            VALUES (${vcid}, ${tcid})`)
    }

}