import { GuildMember, PartialGuildMember, VoiceConnection } from 'discord.js';
import { inject, injectable } from 'inversify';
import { RecPermissionGetter } from './recpermissiongetter';
import { Transcriber } from './transcriber';
import { TranscriptionSender } from './transcriptionsender';
import { TYPES } from '../../types';
import { StandardEmbedMaker } from '../misc/standardembedmaker';
import { TranscriptionChannelGetter } from './transcriptionchannelgetter';
import { RecordingPermissionState } from '../repositories/usersettings/usersettings';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';

@injectable()
export class TranscriptionManager {
    private transcriber: Transcriber;
    private transcriptionSender: TranscriptionSender;
    private permissiongetter: RecPermissionGetter;
    private transcriptionChannelGetter: TranscriptionChannelGetter;
    private embedMaker: StandardEmbedMaker;

    public constructor(
        @inject(TYPES.Transcriber) transcriber: Transcriber,
        @inject(TYPES.TranscriptionSender) sender: TranscriptionSender,
        @inject(TYPES.PermissionGetter) consent: RecPermissionGetter,
        @inject(TYPES.TranscriptionChannelGetter) channelGetter: TranscriptionChannelGetter,
        @inject(TYPES.StandardEmbedMaker) embed: StandardEmbedMaker
    ) {
        this.transcriber = transcriber;
        this.transcriptionSender = sender;
        this.permissiongetter = consent;
        this.transcriptionChannelGetter = channelGetter;
        this.embedMaker = embed;
    }

    public async speaking(vc: VoiceConnection, member: GuildMember | PartialGuildMember): Promise<void> {
        const state = await this.permissiongetter.getPermission(member.user);
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
            this.transcriber.transcribe(stream, function (words: string, err: unknown) {
                if (err === undefined) {
                    s.send(member, channel, vc.channel.name, words);
                    Logger.verbose(
                        `Transcription succeeded for user with id ${member.user.id} in voice channel with id ${vc.channel.id}`,
                        LogOrigin.Transcription
                    );
                } else {
                    const e = embed.makeWarning();
                    e.description =
                        "Problem transcribing audio. This usually doesn't happen, but it's nothing to worry about.";
                    channel.send(e);
                    Logger.verbose(
                        `Transcription failed for user with id ${member.user.id} in voice channel with id ${vc.channel.id}`,
                        LogOrigin.Transcription
                    );
                }
            });
        }
    }
}
