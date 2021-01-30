import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DiscordId } from '../services/interface/misc/misctypes';

@Entity()
export class TranscriptionPair {
    @PrimaryColumn('varchar', { length: 20 })
    voiceId: DiscordId;

    @Column('varchar', { length: 20 })
    textId: DiscordId;

    @Column('varchar', { length: 20 })
    guildId: DiscordId;
}
