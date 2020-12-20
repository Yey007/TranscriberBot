import { inject, injectable } from 'inversify';
import { Connection, RowDataPacket } from 'mysql2/promise';
import SQL from 'sql-template-strings';
import { TYPES } from '../../../types';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { SettingsRepository } from '../settingsrepository';

//TODO: Type alias a textchannel and use that instead of string
@injectable()
export class DbTranscriptChanRepository extends SettingsRepository<string> {
    private db: Connection;

    public constructor(@inject(TYPES.Database) db: Connection) {
        super();
        this.db = db;
    }

    public async get(vcid: string): Promise<string> {
        const [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT textId FROM transcription_channels
            WHERE voiceId=${vcid}`
        );

        Logger.verbose(
            `Retreived transcription channel for voice channel with id ${vcid}. The retrieved channel id is ${rows[0]?.textId}`,
            LogOrigin.MySQL
        );

        //TODO: Convert to that questionmark dot thing
        if (rows[0]) return rows[0].textId;
        else return null;
    }
    public async set(vcid: string, tcid: string): Promise<void> {
        await this.db.query(
            SQL`REPLACE INTO transcription_channels(voiceId, textId)
            VALUES (${vcid}, ${tcid})`
        );
        Logger.verbose(
            `Created or updated transcription channel for voice channel with id ${vcid}. The new transcription channel id is ${tcid}`,
            LogOrigin.MySQL
        );
    }
}
