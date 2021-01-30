import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DiscordId } from '../services/interface/misc/misctypes';

@Entity()
export class GuildSettings {
    @PrimaryColumn('varchar', { length: 20 })
    guildId: DiscordId;

    @Column('varchar', { length: 5 })
    prefix: string;
}
