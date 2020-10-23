import { GuildMember, PartialGuildMember, TextChannel, VoiceConnection } from "discord.js";
import { inject, injectable } from "inversify";
import { PermissionGetter } from "./consentgetter";
import { Transcriber } from "./transcriber";
import { TranscriptionSender } from "./transcriptionsender";
import { TYPES } from "../types";

@injectable()
export class TranscriptionManager {
    private transcriber: Transcriber
    private sender: TranscriptionSender
    private consent: PermissionGetter

    public constructor(
        @inject(TYPES.Transcriber) transcriber: Transcriber,
        @inject(TYPES.TranscriptionSender) sender: TranscriptionSender,
        @inject(TYPES.ConsentGetter) consent: PermissionGetter) {
        this.transcriber = transcriber
        this.sender = sender
        this.consent = consent
    }

    public async speaking(vc: VoiceConnection, member: GuildMember | PartialGuildMember): Promise<void> {

        this.consent.getPermission(member.user, (accepted) => {
            if(accepted) {
                let stream = vc.receiver.createStream(member.user, { mode: "pcm", end: "silence" })
                let s = this.sender
                this.transcriber.transcribe(stream, function (words: string, err: any) {
                    // temporary
                    let channel = member.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0) as TextChannel
                    if (err === null) {
                        s.send(member.user, channel, words)
                    } else {
                        channel.send("Problem transcribing audio")
                    }
                })
            }
        })
    }
}