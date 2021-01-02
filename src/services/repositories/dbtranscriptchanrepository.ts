import { Client, GuildChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import { Connection, RowDataPacket } from 'mysql2/promise';
import SQL from 'sql-template-strings';
import { TYPES } from '../../types';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { DiscordId, TranscriptionPair } from './repotypes';
import { TranscriptChanRepository } from './transcriptchanrepository';

@injectable()
export class DbTranscriptChanRepository extends TranscriptChanRepository {
    private db: Connection;
    private client: Client;

    public constructor(@inject(TYPES.Database) db: Connection, @inject(TYPES.Client) client: Client) {
        super();
        this.db = db;
        this.client = client;
    }

    public async get(vcid: DiscordId): Promise<DiscordId> {
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
    public async set(vcid: DiscordId, tcid: DiscordId): Promise<void> {
        //This isn't great but at least it's clean + this operation doesn't happen often so it's fine.
        const channel = (await this.client.channels.fetch(tcid)) as GuildChannel;
        await this.db.query(
            SQL`REPLACE INTO transcription_channels(voiceId, textId, guildId)
            VALUES (${vcid}, ${tcid}, ${channel.guild.id})`
        );
        Logger.verbose(
            `Created or updated transcription channel for voice channel with id ${vcid}. The new transcription channel id is ${tcid}`,
            LogOrigin.MySQL
        );
    }
    public async getByGuild(guildid: DiscordId): Promise<TranscriptionPair[]> {
        const [rows] = await this.db.query<RowDataPacket[]>(
            SQL`SELECT voiceId, textId FROM transcription_channels WHERE guildId=${guildid}`
        );

        return rows.map((row) => ({
            textId: row.textId,
            voiceId: row.voiceId
        }));
    }
    public async remove(vcid: DiscordId): Promise<void> {
        await this.db.query(SQL`DELETE FROM transcription_channels WHERE voiceId=${vcid}`);
    }
}
