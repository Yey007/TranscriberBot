import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { StandardEmbedMaker } from '../../misc/standardembedmaker';
import { managerOrAdminRequired } from '../../permissions/rolerequierments';
import { GuildSettings } from '../../repositories/guildsettings/guildsettings';
import { SettingsRepository } from '../../repositories/settingsrepository';
import { BotCommand } from '../botcommand';
import { CommandArgs } from '../commandargs';

@injectable()
export class Prefix extends BotCommand {
    private repo: SettingsRepository<GuildSettings>;
    private maker: StandardEmbedMaker;

    private _help = "sets this bot's prefix for this server";
    private _args: CommandArgs[] = [
        { name: 'new', desc: 'the new prefix this bot should use for commands', optional: true },
    ];

    public constructor(
        @inject(TYPES.GuildSettingsRepository) repo: SettingsRepository<GuildSettings>,
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker,
    ) {
        super();
        this.repo = repo;
        this.maker = maker;
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if (args[1]) {
            //set
            await this.prefixSet(message, args[1]);
        } else {
            //get
            await this.prefixGet(message);
        }
    }

    @managerOrAdminRequired
    private async prefixSet(message: Message, prefix: string): Promise<void> {
        if (prefix.length > 5) {
            const embed = this.maker.makeWarning();
            embed.description = 'Prefix cannot be more than 5 characters.';
            message.channel.send(embed);
            return;
        }
        this.repo.set(message.guild.id, { prefix: prefix });
        const embed = this.maker.makeSuccess();
        embed.description = `Prefix set to \`${prefix}\``;
        message.channel.send(embed);
    }

    private async prefixGet(message: Message): Promise<void> {
        const embed = this.maker.makeInfo();
        const settings = await this.repo.get(message.guild.id);
        embed.description = `The prefix is currently \`${settings.prefix}\``;
        message.channel.send(embed);
    }

    public get help(): string {
        return this._help;
    }
    public get args(): CommandArgs[] {
        return this._args;
    }
}
