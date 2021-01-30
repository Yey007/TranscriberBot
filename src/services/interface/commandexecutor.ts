import { Message } from 'discord.js';
import { MainCommandMapper } from './commandmapper';
import { StandardEmbedMaker } from './misc/standardembedmaker';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { checkedSend } from './misc/checkedsend';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { GuildSettingsRepository } from '../repositories/guildrepo';

@Service()
export class CommandExecutor {
    public constructor(
        private maker: StandardEmbedMaker,
        private mapper: MainCommandMapper,
        @InjectRepository() private repo: GuildSettingsRepository
    ) {}

    public async executeCommand(message: Message): Promise<void> {
        if (process.env.NODE_ENV !== 'testing' && message.author.bot) {
            Logger.verbose(
                `Execution of message "${message.content}" aborted because author was a bot and enviornment was not testing`,
                LogOrigin.Discord
            );
            return;
        }

        if (message.channel.type === 'dm') {
            Logger.verbose(
                `Execution of message "${message.content}" aborted because message was sent in a DM`,
                LogOrigin.Discord
            );
            return;
        }
        const settings = await this.repo.findOneOrDefaults(message.guild.id);
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
            Logger.verbose(
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

                embed.setFooter(`Use "help ${args[0]}" for more information.`);
                checkedSend(message.channel, embed);
                Logger.verbose(
                    `Execution of command "${trimmed}" aborted because number of arguments was wrong`,
                    LogOrigin.Discord
                );
                return;
            }
            Logger.verbose(`Executing command "${trimmed}"`, LogOrigin.Discord);
            cmd.execute(message, args);
        } else {
            const embed = this.maker.makeWarning();
            embed.title = 'Command not found';
            embed.description = `The command "${args[0]}" does not exist.`;
            checkedSend(message.channel, embed);
            Logger.verbose(
                `Execution of command "${trimmed}" aborted because command was not found`,
                LogOrigin.Discord
            );
        }
    }
}
