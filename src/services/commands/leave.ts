import { Message } from "discord.js";
import { injectable } from "inversify";
import { BotCommand } from "./botcommand";

@injectable()
export class ChannelLeaver extends BotCommand {

    private _help = "returns a list of commands"
    private _args: [string, string][] = []

    public async execute(message: Message, args: string[]): Promise<void> {
        if(message.member.guild.me.voice.channel)
        {
            message.member.guild.me.voice.channel.leave()
        }
    }
    
    public get help(): string {
        return this._help
    }

    public get args(): [string, string][] {
        return this._args
    }

}