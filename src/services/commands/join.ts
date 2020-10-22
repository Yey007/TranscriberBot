import { Message, VoiceConnection } from "discord.js";
import { injectable } from "inversify";
import { BotCommand } from "./botcommand";

@injectable()
export class ChannelJoiner extends BotCommand {

    public async execute(message: Message, args: string[]): Promise<void> {
        if(message.member.voice.channel) 
        {
            let vc: VoiceConnection = await message.member.voice.channel.join();

            //Due to the wacky API on recieving audio, something must be sent before we can recieve anything
            let dispatcher = vc.play(process.cwd() + "/resources/dummy.mp3", { volume: 0 })

            dispatcher.on('error', (error) => {
                message.reply("Problem sending/recieving audio.")
            });

        }
    }

    public help(): string {
        return "joins a voice channel"
    }
    
}