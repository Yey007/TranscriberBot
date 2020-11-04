import { injectable } from "inversify";
import { container } from "../../inversify.config";
import { TYPES } from "../../types";
import { BotCommand } from "../commands/botcommand";
import { About } from "../commands/help";
import { ChannelJoiner } from "../commands/join";
import { ChannelLeaver } from "../commands/leave";
import { Help } from "./commands";
import { SetPrefix } from "./setprefix";
import { SetRecordingPermission } from "./setrecordingpermission";
import { SetTranscriptChannel } from "./settranscriptchannel";

@injectable()
export class CommandMapper {

    private m: Map<string, BotCommand>

    public constructor() {
        this.m = new Map()
        this.m.set("join", container.get<ChannelJoiner>(TYPES.ChannelJoiner))
        this.m.set("leave", container.get<ChannelLeaver>(TYPES.ChannelLeaver))
        this.m.set("set-transcript-chan", container.get<SetTranscriptChannel>(TYPES.SetTranscriptChannel))
        this.m.set("set-rec-perm", container.get<SetRecordingPermission>(TYPES.SetRecordingPermission))
        this.m.set("set-prefix", container.get<SetPrefix>(TYPES.SetPrefix))
    }

    public map(command: string): BotCommand {
        //Special case for help command to avoid circular dependency
        if(command === "about") {
            return container.get<About>(TYPES.About)
        }
        if(command === "help") {
            return container.get<Help>(TYPES.Help)
        }
        return this.m.get(command)
    }

    public commands(): [string, BotCommand][] {
        let arr = Array.from(this.m.entries())
        arr.push(["about", container.get<About>(TYPES.About)])
        arr.push(["help", container.get<Help>(TYPES.Help)])
        return arr
    }
}