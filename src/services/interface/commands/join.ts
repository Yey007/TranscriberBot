import { Message, VoiceConnection } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { StandardEmbedMaker } from '../../misc/standardembedmaker';
import { BotCommand } from '../botcommand';
import { CommandArgs } from '../commandargs';

@injectable()
export class ChannelJoiner extends BotCommand {
    private embedMaker: StandardEmbedMaker;
    private _help = 'joins a voice channel';
    private _args: CommandArgs[] = [];

    public constructor(@inject(TYPES.StandardEmbedMaker) embedMaker: StandardEmbedMaker) {
        super();
        this.embedMaker = embedMaker;
    }

    public async execute(message: Message): Promise<void> {
        if (message.member.voice.channel) {
            let vc: VoiceConnection;

            try {
                vc = await message.member.voice.channel.join();
                Logger.verbose(`Successfully joined voice channel with id ${vc.channel.id}`, LogOrigin.Discord);
            } catch (err) {
                const embed = this.embedMaker.makeWarning();
                embed.title = 'Channel Unavailable';
                embed.description = "I can't join that channel. Please make sure I have the correct permissions.";
                message.channel.send(embed);
                Logger.verbose(`Unable to join voice channel with id ${vc.channel.id}`, LogOrigin.Discord);
                return;
            }

            //Due to the wacky API on recieving audio, something must be sent before we can recieve anything
            const dispatcher = vc.play(process.cwd() + '/resources/dummy.mp3', { volume: 0 });

            dispatcher.on('error', () => {
                const embed = this.embedMaker.makeError();
                embed.title = 'Transcription Error';
                embed.description =
                    'There was a problem recieving audio from this channel. If this keeps happening, please contact the author.';
                message.channel.send(embed);
                Logger.warn(`Unable to dispatch audio in voice channel with id ${vc.channel.id}`, LogOrigin.Discord);
            });
        }
    }

    public get help(): string {
        return this._help;
    }

    public get args(): CommandArgs[] {
        return this._args;
    }
}
