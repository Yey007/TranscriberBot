import { GuildMember, PartialGuildMember, VoiceConnection } from 'discord.js';
import { RecPermissionGetter } from './recpermissiongetter';
import { Transcriber } from './transcriber';
import { TranscriptionSender } from './transcriptionsender';
import { StandardEmbedMaker } from '../interface/misc/standardembedmaker';
import { TranscriptionChannelGetter } from './transcriptionchannelgetter';
import { RecordingPermissionState } from '../interface/misc/misctypes';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { Service } from 'typedi';
import { checkedSend } from '../interface/misc/checkedsend';

@Service()
export class TranscriptionManager {
    public constructor(
        private transcriber: Transcriber,
        private transcriptionSender: TranscriptionSender,
        private permissionGetter: RecPermissionGetter,
        private transcriptionChannelGetter: TranscriptionChannelGetter,
        private embedMaker: StandardEmbedMaker
    ) {}

    public async speaking(vc: VoiceConnection, member: GuildMember | PartialGuildMember): Promise<void> {
        const state = await this.permissionGetter.getPermission(member.user);
        if (state === RecordingPermissionState.NoConsent || state === RecordingPermissionState.Unknown) {
            Logger.verbose(
                `Permission check failed for user with id ${member.user.id}. Aborting transcription`,
                LogOrigin.Discord
            );
            return;
        }
        const stream = vc.receiver.createStream(member.user, { mode: 'pcm', end: 'silence' });
        const s = this.transcriptionSender;
        const embed = this.embedMaker;

        const channel = await this.transcriptionChannelGetter.get(member.guild, vc.channel.id);
        if (channel !== undefined) {
            this.transcriber.transcribe(stream, async function (words: string, err: unknown) {
                if (err === undefined) {
                    await s.send(member, channel, vc.channel.name, words);
                    Logger.verbose(
                        `Transcription succeeded for user with id ${member.user.id} in voice channel with id ${vc.channel.id}`,
                        LogOrigin.Transcription
                    );
                } else {
                    const e = embed.makeWarning();
                    e.description =
                        "Problem transcribing audio. This usually doesn't happen, but it's nothing to worry about.";
                    await checkedSend(channel, e);
                    Logger.verbose(
                        `Transcription failed for user with id ${member.user.id} in voice channel with id ${vc.channel.id}`,
                        LogOrigin.Transcription
                    );
                }
            });
        }
    }
}
