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
    private _help = 'allows for various operations involving transcription channels';
    private _args: CommandArgs[] = [
        {
            name: 'operation',
            desc:
                'can be `create`, `remove` or `all`. `create` will create a new transcription channel, `remove` will remove one, and `all` will return a list of all transcription channels.',
            optional: false
        },
        {
            name: 'voiceChannel',
            desc:
                'the name of the voice channel that should be used for the specified operation. Not required if the operation is `all`',
            optional: true
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
        if (args[1] === 'create') {
            await this.setChannel(message, args);
        } else if (args[1] === 'remove') {
            await this.removeChannel(message, args);
        } else if (args[1] === 'all') {
            await this.allChannels(message);
        } else {
            const embed = this.maker.makeWarning();
            embed.description = 'Invalid operation. Valid operations are `create`, `remove`, and `all`';
            message.channel.send(embed);
        }
    }

    @managerOrAdminRequired
    public async setChannel(message: Message, args: string[]): Promise<void> {
        const vc = message.guild.channels.cache.find((x) => x.name === args[2] && x.type === 'voice');
        if (vc !== undefined) {
            await this.repo.set(vc.id, message.channel.id);
            const embed = this.maker.makeSuccess();
            embed.description = `Set the transcription channel for \`${args[2]}\` to this channel`;
            message.channel.send(embed);
            Logger.verbose(
                `Sent transcription channel set success message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        } else {
            const embed = this.maker.makeWarning();
            embed.description = `Voice channel \`${args[2]}\` not found`;
            message.channel.send(embed);
            Logger.verbose(
                `Sent transcription channel set failure message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        }
    }

    @managerOrAdminRequired
    public async removeChannel(message: Message, args: string[]): Promise<void> {
        const vc = message.guild.channels.cache.find((x) => x.name === args[2] && x.type === 'voice');
        if (vc !== undefined) {
            const fromDb = await this.repo.get(vc.id);
            if (fromDb === null) {
                const embed = this.maker.makeWarning();
                embed.description = `A transcription channel for the voice channel \`${args[2]}\` does not exist`;
                message.channel.send(embed);
                return;
            }

            await this.repo.remove(vc.id);
            const embed = this.maker.makeSuccess();
            embed.description = `Removed the transcription channel for \`${args[2]}\``;
            message.channel.send(embed);
            Logger.verbose(
                `Sent transcription channel remove success message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        } else {
            const embed = this.maker.makeWarning();
            embed.description = `Voice channel \`${args[2]}\` not found`;
            message.channel.send(embed);
            Logger.verbose(
                `Sent transcription channel remove failure message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        }
    }

    public async allChannels(message: Message): Promise<void> {
        const allIds = await this.repo.getByGuild(message.guild.id);
        const allNames = allIds.map((pair) => ({
            voice: message.guild.channels.resolve(pair.voiceId).name,
            text: `<#${message.guild.channels.resolve(pair.textId).id}>`
        }));
        const embed = this.maker.makeInfo();
        embed.title = 'All Transcription Channels';
        for (const namePair of allNames) {
            embed.description += `${namePair.voice} :arrow_right: ${namePair.text}\n`;
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
