import { Message, VoiceConnection } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { Transcriber } from "../transcriber";
import { BotCommand } from "./botcommand";

@injectable()
export class ChannelJoiner extends BotCommand {

    private transcriber: Transcriber

    public constructor(
        @inject(TYPES.Transcriber) transcriber) 
    {
        super()
        this.transcriber = transcriber
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if(message.member.voice.channel) 
        {
            let vc: VoiceConnection = await message.member.voice.channel.join();

            //Due to the wacky API on recieving audio, something must be sent before we can recieve anything
            let dispatcher = vc.play(process.cwd() + "/resources/dummy.mp3", {volume: 0})
            
            dispatcher.on('error', (error) => {
                message.reply("Problem sending/recieving audio.")
            });

            //TODO: Handle disconnects properly
            //TODO: Handle hesitation markers
            //TODO: Proper embeds for nicer messages?
            //TODO: Maybe capitalize first word, add periods at end?
            vc.on("speaking", async (user, speaking) => {
                if(speaking.bitfield === 1) {

                    let stream = vc.receiver.createStream(user, {mode: "pcm", end: "silence"})
                    this.transcriber.transcribe(stream, function (words: string, err: any) {
                        if(err === null) {
                            message.channel.send(`[${user.username}] ` + words)
                        } else {
                            message.reply("Problem transcribing audio.")
                        }
                    })
                    
                }
            })
        }
    }

    public help(): string {
        return "Joins a channel"
    }
    
}