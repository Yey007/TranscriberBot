import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { MainCommandMapper } from './commandmapper';
import { StandardEmbedMaker } from '../misc/standardembedmaker';
import { GuildSettings } from '../repositories/guildsettings/guildsettings';
import { SettingsRepository } from '../repositories/settingsrepository';

@injectable()
export class CommandExecutor {
    private maker: StandardEmbedMaker;
    private mapper: MainCommandMapper;
    private repo: SettingsRepository<GuildSettings>;

    public constructor(
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker,
        @inject(TYPES.CommandMapper) mapper: MainCommandMapper,
        @inject(TYPES.GuildSettingsRepository) repo: SettingsRepository<GuildSettings>,
    ) {
        this.maker = maker;
        this.mapper = mapper;
        this.repo = repo;
    }

    public async executeCommand(message: Message): Promise<void> {
        if (process.env.NODE_ENV === 'production' && message.author.bot) return;

        if (message.channel.type === 'dm') return;

        const settings = await this.repo.get(message.guild.id);
        let trimmed = '';
        if (message.content.startsWith(settings.prefix)) {
            trimmed = message.content.slice(settings.prefix.length, message.content.length);
            //Starts with mention
        } else if (
            message.content.startsWith(`<@${message.guild.me.user.id}>`) ||
            message.content.startsWith(`<@!${message.guild.me.user.id}>`)
        ) {
            trimmed = message.content.slice(message.content.indexOf(' ') + 1, message.content.length);
        } else {
            return;
        }

        const args = trimmed.split(' ');
        const cmd = this.mapper.map(args[0]);
        if (cmd !== undefined) {
            const requiredLength = cmd.args.filter((arg) => !arg.optional).length;
            const allLength = cmd.args.length;
            if (args.length - 1 < requiredLength || args.length - 1 > allLength) {
                const embed = this.maker.makeWarning();

                const requiredPlural = requiredLength === 1 ? 'argument' : 'arguments';
                const allPlural = allLength === 1 ? 'argument' : 'arguments';

                embed.title = 'Invalid Arguments';
                embed.description = `This command requires at least ${requiredLength} ${requiredPlural} and 
                accepts at most ${allLength} ${allPlural} but you provided ${args.length - 1}.`;

                embed.setFooter(`Use about ${args[0]} for more information.`);

                message.channel.send(embed);
                return;
            }
            cmd.execute(message, args);
        } else {
            const embed = this.maker.makeWarning();
            embed.title = 'Command not found';
            embed.description = `The command "${args[0]}" does not exist.`;
            message.channel.send(embed);
        }
    }
}
