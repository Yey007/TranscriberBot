import { injectable } from "inversify";
import { container } from "../../inversify.config";
import { TYPES } from "../../types";
import { BotCommand } from "../commands/botcommand";
import { HelpSender } from "../commands/help";
import { ChannelJoiner } from "../commands/join";
import { ChannelLeaver } from "../commands/leave";
import { Commands } from "./commands";
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
    }

    public map(command: string): BotCommand {
        //Special case for help command to avoid circular dependency
        if(command === "help") {
            return container.get<HelpSender>(TYPES.HelpSender)
        }
        if(command === "commands") {
            return container.get<Commands>(TYPES.Commands)
        }
        return this.m.get(command)
    }

    public commands(): [string, BotCommand][] {
        let arr = Array.from(this.m.entries())
        arr.push(["help", container.get<HelpSender>(TYPES.HelpSender)])
        arr.push(["commands", container.get<Commands>(TYPES.Commands)])
        return arr
    }
}