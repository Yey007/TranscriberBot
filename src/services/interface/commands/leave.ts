import { Message } from 'discord.js';
import { injectable } from 'inversify';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { BotCommand } from '../botcommand';
import { CommandArgs } from '../commandargs';

@injectable()
export class ChannelLeaver extends BotCommand {
    private _help = 'returns a list of commands';
    private _args: CommandArgs[] = [];

    public async execute(message: Message): Promise<void> {
        if (message.member.guild.me.voice.channel) {
            message.member.guild.me.voice.channel.leave();
            Logger.verbose(`Left voice channel with id ${message.member.guild.me.voice.channel.id}`, LogOrigin.Discord);
        }
    }

    public get help(): string {
        return this._help;
    }

    public get args(): CommandArgs[] {
        return this._args;
    }
}
