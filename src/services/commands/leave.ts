import { Message } from "discord.js";
import { injectable } from "inversify";
import { BotCommand } from "./botcommand";

@injectable()
export class ChannelLeaver extends BotCommand {

    public async execute(message: Message, args: string[]): Promise<void> {
        if(message.member.voice.channel)
        {
            message.member.voice.channel.leave()
        }
    }
    public help(): string {
        return "leaves a voice channel."
    }

}