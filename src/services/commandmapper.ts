import { injectable } from "inversify";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { BotCommand } from "./commands/botcommand";
import { HelpSender } from "./commands/help";
import { ChannelJoiner } from "./commands/join";
import { ChannelLeaver } from "./commands/leave";

@injectable()
export class CommandMapper {

    private m: Map<string, BotCommand>

    public constructor() {
        this.m = new Map()
        this.m.set("join", container.get<ChannelJoiner>(TYPES.ChannelJoiner))
        this.m.set("leave", container.get<ChannelLeaver>(TYPES.ChannelLeaver))
    }

    public map(command: string): BotCommand {

        //Special case for help command to avoid circular dependency
        if(command === "help") {
            return container.get<HelpSender>(TYPES.HelpSender)
        }
        return this.m.get(command)
    }

    public commands(): IterableIterator<BotCommand> {
        return this.m.values()
    }
}