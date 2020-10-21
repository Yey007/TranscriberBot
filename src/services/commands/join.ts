import { Message, VoiceConnection } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { ConsentGetter } from "../consentgetter";
import { Transcriber } from "../transcriber";
import { TranscriptionSender } from "../transcriptionsender";
import { BotCommand } from "./botcommand";

@injectable()
export class ChannelJoiner extends BotCommand {

    private transcriber: Transcriber
    private sender: TranscriptionSender
    private consent: ConsentGetter

    public constructor(
        @inject(TYPES.Transcriber) transcriber: Transcriber,
        @inject(TYPES.TranscriptionSender) sender: TranscriptionSender,
        @inject(TYPES.ConsentGetter) consent: ConsentGetter) 
    {
        super()
        this.transcriber = transcriber
        this.sender = sender
        this.consent = consent
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if(message.member.voice.channel) 
        {
            let vc: VoiceConnection = await message.member.voice.channel.join();

            //Due to the wacky API on recieving audio, something must be sent before we can recieve anything
            let dispatcher = vc.play(process.cwd() + "/resources/dummy.mp3", { volume: 0 })

            dispatcher.on('error', (error) => {
                message.reply("Problem sending/recieving audio.")
            });

            let consented: string[] = []


            vc.on("speaking", async (user, speaking) => {
                if (speaking.bitfield === 1) {

                    if (consented.includes(user.id)) {

                        let stream = vc.receiver.createStream(user, { mode: "pcm", end: "silence" })
                        let s = this.sender
                        this.transcriber.transcribe(stream, function (words: string, err: any) {
                            if (err === null) {
                                s.send(user, message.channel, words)
                            } else {
                                message.reply("Problem transcribing audio.")
                            }
                        })

                    } else {
                        this.consent.getconsent(user, () => {
                            consented.push(user.id) // This is considered thread safe because there is one thread, and that scares me.
                        })
                    }

                }
            })
        }
    }

    public help(): string {
        return "joins a voice channel"
    }
    
}