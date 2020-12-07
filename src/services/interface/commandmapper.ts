import { injectable } from 'inversify';
import { container } from '../../inversify.config';
import { TYPES } from '../../types';
import { BotCommand } from './botcommand';
import { ChannelJoiner } from './commands/join';
import { ChannelLeaver } from './commands/leave';
import { Help } from './commands/help';
import { Prefix } from './commands/prefix';
import { SetRecordingPermission } from './commands/recordingpermission';
import { SetTranscriptChannel } from './commands/settranscriptchannel';

@injectable()
export class MainCommandMapper {
    private m: Map<string, BotCommand>;

    public constructor() {
        this.m = new Map();
        this.m.set('join', container.get<ChannelJoiner>(TYPES.ChannelJoiner));
        this.m.set('leave', container.get<ChannelLeaver>(TYPES.ChannelLeaver));
        this.m.set('set-transcript-chan', container.get<SetTranscriptChannel>(TYPES.SetTranscriptChannel));
        this.m.set('rec-perm', container.get<SetRecordingPermission>(TYPES.SetRecordingPermission));
        this.m.set('prefix', container.get<Prefix>(TYPES.SetPrefix));
    }

    public map(command: string): BotCommand {
        //Special case for help command to avoid circular dependency
        if (command === 'help') {
            return container.get<Help>(TYPES.Help);
        }
        return this.m.get(command);
    }

    public commands(): [string, BotCommand][] {
        const arr = Array.from(this.m.entries());
        arr.push(['help', container.get<Help>(TYPES.Help)]);
        return arr;
    }
}
