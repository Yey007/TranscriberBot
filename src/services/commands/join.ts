import { Message, VoiceConnection } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../standardembedmaker";
import { BotCommand } from "./botcommand";

@injectable()
export class ChannelJoiner extends BotCommand {

    private embedMaker: StandardEmbedMaker

    public constructor(
        @inject(TYPES.StandardEmbedMaker) embedMaker: StandardEmbedMaker) 
    {
        super()
        this.embedMaker = embedMaker
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if(message.member.voice.channel) 
        {
            let vc: VoiceConnection = await message.member.voice.channel.join();

            //Due to the wacky API on recieving audio, something must be sent before we can recieve anything
            let dispatcher = vc.play(process.cwd() + "/resources/dummy.mp3", { volume: 0 })

            dispatcher.on('error', (error) => {
                let embed = this.embedMaker.makeError()
                embed.title = "Transcription Error"
                embed.description = "There was a problem recieving audio from this channel. If this keeps happening, please contact the author."
                message.channel.send(embed)
            });

        }
    }

    public help(): string {
        return "joins a voice channel"
    }
    
}