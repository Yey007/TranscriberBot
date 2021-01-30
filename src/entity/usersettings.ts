import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DiscordId, RecordingPermissionState } from '../services/interface/misc/misctypes';

@Entity()
export class UserSettings {
    @PrimaryColumn('varchar', { length: 20 })
    userId: DiscordId;

    @Column('enum', {
        enum: RecordingPermissionState,
        default: RecordingPermissionState.Unknown
    })
    permission: RecordingPermissionState;
}
