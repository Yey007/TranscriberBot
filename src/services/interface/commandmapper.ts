import { BotCommand } from './botcommand';
import { ChannelJoinCommand } from './commands/join';
import { ChannelLeaveCommand } from './commands/leave';
import { HelpCommand } from './commands/help';
import { PrefixCommand } from './commands/prefix';
import { RecordingPermissionCommand } from './commands/recordingpermission';
import { TranscriptChannelCommand } from './commands/transcriptchannel';
import Container, { Service } from 'typedi';
import { StandardEmbedMaker } from './misc/standardembedmaker';

@Service({ transient: false })
export class MainCommandMapper {
    private m: Map<string, BotCommand>;

    public constructor() {
        this.m = new Map();
        this.m.set('join', Container.get(ChannelJoinCommand));
        this.m.set('leave', Container.get(ChannelLeaveCommand));
        this.m.set('transcript-chan', Container.get(TranscriptChannelCommand));
        this.m.set('rec-perm', Container.get(RecordingPermissionCommand));
        this.m.set('prefix', Container.get(PrefixCommand));

        //Avoid circular dependency
        this.m.set('help', new HelpCommand(this, Container.get(StandardEmbedMaker)));
    }

    public map(command: string): BotCommand {
        return this.m.get(command);
    }

    public commands(): [string, BotCommand][] {
        return Array.from(this.m.entries());
    }
}
