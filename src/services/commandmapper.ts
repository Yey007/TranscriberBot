import { inject, injectable } from "inversify"
import { TYPES } from "../types"
import { BotCommand } from "./commands/botcommand"
import { HelpSender } from "./commands/help"
import { ChannelJoiner } from "./commands/join"

@injectable()
export class CommandMapper {

    private channelJoiner: ChannelJoiner
    private helpSender: HelpSender

    public constructor(
        @inject(TYPES.ChannelJoiner) channelJoiner: ChannelJoiner,
        @inject(TYPES.HelpSender) helpSender: HelpSender) 
    {
        this.channelJoiner = channelJoiner
        this.helpSender = helpSender
    }

	public map(command: string): BotCommand {
        switch (command) {
            case "join":
                return this.channelJoiner
            default:
                return this.helpSender
        }
	}
}