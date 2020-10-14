import { GuildMember, Message, VoiceConnection } from "discord.js";
import { injectable } from "inversify";
import { BotCommand } from "./botcommand";

@injectable()
export class HelpSender extends BotCommand {

    public async execute(message: Message, args: string[]): Promise<void> {

        if(message.member.voice.channel) 
        {
            let vc: VoiceConnection = await message.member.voice.channel.join()
            vc.on("speaking", (member: GuildMember, speaking: boolean) => {
                console.log("speaking")
            })
        }
    }
    public help(): string {
        return "Gives help about a command"
    }

}