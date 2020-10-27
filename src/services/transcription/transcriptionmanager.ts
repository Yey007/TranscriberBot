import { GuildMember, PartialGuildMember, TextChannel, VoiceConnection } from "discord.js";
import { inject, injectable } from "inversify";
import { PermissionGetter } from "./permissiongetter";
import { Transcriber } from "./transcriber";
import { TranscriptionSender } from "./transcriptionsender";
import { TYPES } from "../../types";
import { DbGuildSettingsRespoitory } from "../repositories/guildsettings/dbguildsettingsrepository";

@injectable()
export class TranscriptionManager {
    private transcriber: Transcriber
    private sender: TranscriptionSender
    private consent: PermissionGetter
    private settingsRepo: DbGuildSettingsRespoitory

    public constructor(
        @inject(TYPES.Transcriber) transcriber: Transcriber,
        @inject(TYPES.TranscriptionSender) sender: TranscriptionSender,
        @inject(TYPES.PermissionGetter) consent: PermissionGetter,
        @inject(TYPES.GuildSettingsRepository) settingsRepo: DbGuildSettingsRespoitory) {
        this.transcriber = transcriber
        this.sender = sender
        this.consent = consent
        this.settingsRepo = settingsRepo
    }

    public async speaking(vc: VoiceConnection, member: GuildMember | PartialGuildMember): Promise<void> {

        this.consent.getPermission(member.user, (accepted) => {
            if (!accepted)
                return
            let stream = vc.receiver.createStream(member.user, { mode: "pcm", end: "silence" })
            let s = this.sender
            let repo = this.settingsRepo
            this.transcriber.transcribe(stream, function (words: string, err: any) {

                repo.get(member.guild.id, (settings) => {

                    if (settings !== undefined && settings.transcriptionChannelId !== undefined) {
                        let channel = member.guild.channels.cache.get(settings.transcriptionChannelId) as TextChannel
                        if (err === null) {
                            s.send(member, channel, words)
                        } else {
                            channel.send("Problem transcribing audio. This usually doesn't happen, but it's nothing to worry about.")
                        }
                    } else {
                        // Channel undefined logic here
                    }

                })

            })

        })
    }
}