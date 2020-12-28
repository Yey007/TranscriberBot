import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { MainCommandMapper } from './commandmapper';
import { StandardEmbedMaker } from '../misc/standardembedmaker';
import { GuildSettings } from '../repositories/repotypes';
import { SettingsRepository } from '../repositories/settingsrepository';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';

@injectable()
export class CommandExecutor {
    private maker: StandardEmbedMaker;
    private mapper: MainCommandMapper;
    private repo: SettingsRepository<GuildSettings>;

    public constructor(
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker,
        @inject(TYPES.CommandMapper) mapper: MainCommandMapper,
        @inject(TYPES.GuildSettingsRepository) repo: SettingsRepository<GuildSettings>
    ) {
        this.maker = maker;
        this.mapper = mapper;
        this.repo = repo;
    }

    public async executeCommand(message: Message): Promise<void> {
        if (process.env.NODE_ENV !== 'testing' && message.author.bot) {
            Logger.debug(
                `Execution of message "${message.content}" aborted because author was a bot and enviornment was not testing`,
                LogOrigin.Discord
            );
            return;
        }

        if (message.channel.type === 'dm') {
            Logger.debug(
                `Execution of message "${message.content}" aborted because message was sent in a DM`,
                LogOrigin.Discord
            );
            return;
        }

        const settings = await this.repo.get(message.guild.id);
        let trimmed = '';
        if (message.content.startsWith(settings.prefix)) {
            //Starts with prefix
            trimmed = message.content.slice(settings.prefix.length, message.content.length);
            Logger.verbose(`Prefix execution detected for command ${trimmed}`, LogOrigin.Discord);
        } else if (
            message.content.startsWith(`<@${message.guild.me.user.id}>`) ||
            message.content.startsWith(`<@!${message.guild.me.user.id}>`)
        ) {
            //Starts with mention
            trimmed = message.content.slice(message.content.indexOf(' ') + 1, message.content.length);
            Logger.verbose(`Mention execution detected for command ${trimmed}`, LogOrigin.Discord);
        } else {
            Logger.debug(
                `Execution of message "${message.content}" aborted because prefix or mention was not detected`,
                LogOrigin.Discord
            );
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
                Logger.verbose(
                    `Execution of command "${trimmed}" aborted because number of arguments was wrong`,
                    LogOrigin.Discord
                );
                return;
            }
            cmd.execute(message, args);
        } else {
            const embed = this.maker.makeWarning();
            embed.title = 'Command not found';
            embed.description = `The command "${args[0]}" does not exist.`;
            message.channel.send(embed);
            Logger.verbose(
                `Execution of command "${trimmed}" aborted because command was not found`,
                LogOrigin.Discord
            );
        }
    }
}
