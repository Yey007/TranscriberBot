import { Message } from 'discord.js';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { checkedSend } from '../misc/checkedsend';
import { StandardEmbedMaker } from '../misc/standardembedmaker';
import { managerOrAdminRequired } from '../../permissions/rolerequierments';
import { BotCommand } from '../botcommand';
import { CommandArgs } from '../commandargs';
import { GuildSettingsRepository } from '../../repositories/guildrepo';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { GuildSettings } from '../../../entity/guildsettings';

@Service()
export class PrefixCommand extends BotCommand {
    private _help = "sets this bot's prefix for this server";
    private _args: CommandArgs[] = [
        { name: 'new', desc: 'the new prefix this bot should use for commands', optional: true }
    ];

    public constructor(@InjectRepository() private repo: GuildSettingsRepository, private maker: StandardEmbedMaker) {
        super();
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
            await checkedSend(message.channel, embed);
            return;
        }
        const repoSave = this.repo.save<GuildSettings>({
            guildId: message.guild.id,
            prefix: prefix
        });
        const embed = this.maker.makeSuccess();
        embed.description = `Prefix set to \`${prefix}\``;
        const send = checkedSend(message.channel, embed);
        await Promise.all([repoSave, send]);
        Logger.verbose(`Sent prefix set success message in channel with id ${message.channel.id}`, LogOrigin.Discord);
    }

    private async prefixGet(message: Message): Promise<void> {
        const embed = this.maker.makeInfo();
        const settings = await this.repo.findOneOrDefaults(message.guild.id);
        embed.description = `The prefix is currently \`${settings.prefix}\``;
        await checkedSend(message.channel, embed);
        Logger.verbose(`Sent prefix get message in channel with id ${message.channel.id}`, LogOrigin.Discord);
    }

    public get help(): string {
        return this._help;
    }
    public get args(): CommandArgs[] {
        return this._args;
    }
}
