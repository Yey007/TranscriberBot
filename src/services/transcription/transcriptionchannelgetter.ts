import { Guild, TextChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { SettingsRepository } from '../repositories/settingsrepository';

@injectable()
export class TranscriptionChannelGetter {
    private transcriptionChannelRepo: SettingsRepository<string>;

    public constructor(
        @inject(TYPES.TranscriptionChannelRespository) transcriptionChannelRepo: SettingsRepository<string>
    ) {
        this.transcriptionChannelRepo = transcriptionChannelRepo;
    }

    public async get(guild: Guild, vcId: string): Promise<TextChannel> {
        const textId = await this.transcriptionChannelRepo.get(vcId);

        let chan = guild.channels.cache.get(textId);
        if (chan !== undefined) {
            Logger.verbose(`Found transcription channel for voice channel with id ${vcId}`, LogOrigin.Transcription);
            return chan as TextChannel;
        }

        // This may not exist, but this function can't deal with it at that point.
        Logger.verbose(
            `Failed to find transcription channel for voice channel with id ${vcId}. Resorting to channel search`,
            LogOrigin.Transcription
        );
        chan = guild.channels.cache.find(
            (channel) => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES')
        );
        const textChan = chan as TextChannel;
        if (textChan === null || textChan === undefined)
            Logger.verbose(`Failed channel search for voice channel with id ${vcId}`, LogOrigin.Transcription);

        return textChan;
    }
}
