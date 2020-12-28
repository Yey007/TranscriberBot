import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { StandardEmbedMaker } from '../../misc/standardembedmaker';
import { managerOrAdminRequired } from '../../permissions/rolerequierments';
import { TranscriptChanRepository } from '../../repositories/transcriptchanrepository';
import { BotCommand } from '../botcommand';
import { CommandArgs } from '../commandargs';

@injectable()
export class TranscriptChannel extends BotCommand {
    private repo: TranscriptChanRepository;
    private maker: StandardEmbedMaker;
    private _help = 'sets the transcription channel for a discord server as the current channel';
    private _args: CommandArgs[] = [
        {
            name: 'voiceChannel',
            desc:
                'the name of the voice channel that should be transcribed into this channel. If this is set to "all", all transcription channels will be returned.',
            optional: false
        }
    ];

    public constructor(
        @inject(TYPES.TranscriptionChannelRespository) repo: TranscriptChanRepository,
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker
    ) {
        super();
        this.repo = repo;
        this.maker = maker;
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if (args[1] === 'all') {
            await this.getAll(message);
        } else {
            await this.setChannel(message, args);
        }
    }

    @managerOrAdminRequired
    public async setChannel(message: Message, args: string[]): Promise<void> {
        const vc = message.guild.channels.cache.find((x) => x.name === args[1] && x.type === 'voice');
        if (vc !== undefined) {
            await this.repo.set(vc.id, message.channel.id);
            const embed = this.maker.makeSuccess();
            embed.description = `Set the transcription channel for \`${args[1]}\` to this channel`;
            message.channel.send(embed);
            Logger.verbose(
                `Sent transcription channel set success message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        } else {
            const embed = this.maker.makeWarning();
            embed.description = `Voice channel \`${args[1]}\` not found`;
            message.channel.send(embed);
            Logger.verbose(
                `Sent transcription channel set failure message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        }
    }

    public async getAll(message: Message): Promise<void> {
        const allIds = await this.repo.getByGuild(message.guild.id);
        const allNames = allIds.map((pair) => ({
            voice: message.guild.channels.resolve(pair.voiceId).name,
            text: `<#${message.guild.channels.resolve(pair.textId).id}>`
        }));
        const embed = this.maker.makeInfo();
        embed.title = 'All Transcription Channels';
        for (const namePair of allNames) {
            embed.description += `${namePair.voice}   :arrow_right:   ${namePair.text}\n`;
        }
        message.channel.send(embed);
    }

    public get help(): string {
        return this._help;
    }

    public get args(): CommandArgs[] {
        return this._args;
    }
}
