import { GuildMember, PartialGuildMember, TextChannel, VoiceConnection } from "discord.js";
import { inject, injectable } from "inversify";
import { PermissionGetter } from "./permissiongetter";
import { Transcriber } from "./transcriber";
import { TranscriptionSender } from "./transcriptionsender";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../misc/standardembedmaker";
import { TranscriptionChannelGetter } from "./transcriptionchannelgetter";
import { RecordingPermissionState } from "../repositories/usersettings/usersettings";

//TODO: Per voice channel transcriptions
@injectable()
export class TranscriptionManager {

    private transcriber: Transcriber
    private transcriptionSender: TranscriptionSender
    private permissiongetter: PermissionGetter
    private transcriptionChannelGetter: TranscriptionChannelGetter
    private embedMaker: StandardEmbedMaker

    public constructor(
        @inject(TYPES.Transcriber) transcriber: Transcriber,
        @inject(TYPES.TranscriptionSender) sender: TranscriptionSender,
        @inject(TYPES.PermissionGetter) consent: PermissionGetter,
        @inject(TYPES.TranscriptionChannelGetter) channelGetter: TranscriptionChannelGetter,
        @inject(TYPES.StandardEmbedMaker) embed: StandardEmbedMaker)        
    {
        this.transcriber = transcriber
        this.transcriptionSender = sender
        this.permissiongetter = consent
        this.transcriptionChannelGetter = channelGetter
        this.embedMaker = embed
    }

    public async speaking(vc: VoiceConnection, member: GuildMember | PartialGuildMember): Promise<void> {
        let state = await this.permissiongetter.getPermission(member.user)
        if (state === RecordingPermissionState.NoConsent || state === RecordingPermissionState.Unknown)
            return
        let stream = vc.receiver.createStream(member.user, { mode: "pcm", end: "silence" })
        let s = this.transcriptionSender
        let embed = this.embedMaker

        let channel = await this.transcriptionChannelGetter.get(member.guild, vc.channel.id)
        if (channel !== undefined) {

            this.transcriber.transcribe(stream, function (words: string, err: any) {
                if (err === undefined) {
                    s.send(member, channel, vc.channel.name, words)
                } else {
                    let e = embed.makeWarning()
                    e.description = "Problem transcribing audio. This usually doesn't happen, but it's nothing to worry about."
                    channel.send(e)
                }
            })

        }
    }
}