import { Guild, TextChannel } from 'discord.js';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { TranscriptionPairRepository } from '../repositories/transcriptionrepo';

@Service()
export class TranscriptionChannelGetter {
    public constructor(@InjectRepository() private transcriptionChannelRepo: TranscriptionPairRepository) {}

    public async get(guild: Guild, vcId: string): Promise<TextChannel> {
        const pair = await this.transcriptionChannelRepo.findOne(vcId);

        let chan = guild.channels.cache.get(pair.textId);
        if (chan !== undefined) {
            Logger.verbose(`Found transcription channel for voice channel with id ${vcId}`, LogOrigin.Transcription);
            return chan as TextChannel;
        }

        Logger.verbose(
            `Failed to find transcription channel for voice channel with id ${vcId}. Resorting to channel search`,
            LogOrigin.Transcription
        );

        // This may not exist, but this function can't deal with it at that point.
        chan = guild.channels.cache.find(
            (channel) => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES')
        );
        const textChan = chan as TextChannel;
        if (textChan === null || textChan === undefined)
            Logger.verbose(`Failed channel search for voice channel with id ${vcId}`, LogOrigin.Transcription);

        return textChan;
    }
}
