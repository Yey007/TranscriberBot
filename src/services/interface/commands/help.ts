import { Message } from 'discord.js';
import { inject } from 'inversify';
import { TYPES } from '../../../types';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { checkedSend } from '../../misc/checkedsend';
import { StandardEmbedMaker } from '../../misc/standardembedmaker';
import { BotCommand } from '../botcommand';
import { CommandArgs } from '../commandargs';
import { MainCommandMapper } from '../commandmapper';

export class Help extends BotCommand {
    private mapper: MainCommandMapper;
    private maker: StandardEmbedMaker;
    private _help = 'returns a list of commands';
    private _args: CommandArgs[] = [{ name: 'command', desc: 'the command to give help about', optional: true }];

    public constructor(
        @inject(TYPES.CommandMapper) mapper: MainCommandMapper,
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker
    ) {
        super();
        this.mapper = mapper;
        this.maker = maker;
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if (args[1]) {
            this.specificHelp(message, args[1]);
        } else {
            this.genericHelp(message);
        }
    }

    private genericHelp(message: Message) {
        const e = this.maker.makeInfo();
        e.title = 'Help';

        let commands = '';
        this.mapper
            .commands()
            .sort((a, b) => {
                const [nameA] = a;
                const [nameB] = b;
                return nameA.localeCompare(nameB);
            })
            .forEach(([name, command]) => {
                commands += `\`${name}\` - ${command.help}\n`;
            });
        e.addField('Commands', commands);

        e.addField(
            'Addressing',
            `You can address the bot in two ways\n\n1. Mention the bot at the start of your message, like this: **${message.guild.me.toString()} command**\n2. Use the prefix (! by default), like this: **!command**`
        );

        checkedSend(message.channel, e);
        Logger.verbose(`Generic help sent in channel with id ${message.channel.id}`, LogOrigin.Discord);
    }

    //Argument order, which arguments are required etc.
    private specificHelp(message: Message, command: string) {
        const cmd = this.mapper.map(command);
        if (cmd !== undefined) {
            const embed = this.maker.makeInfo();
            embed.title = 'Help';

            //What the command does overall
            embed.description = `\`${command}\` ${cmd.help}\nBrackets [] denote optional arguments.`;

            let usage = '`' + command;
            let argumentString = '';
            for (const arg of cmd.args) {
                usage += arg.optional ? ` [${arg.name}]` : ` ${arg.name}`; //If optional surround with brackets
                argumentString += `\`${arg.name}\` - ${arg.desc}\n`; //add name and description to list
            }
            usage += '`';

            embed.addField('Usage', usage);
            if (argumentString !== '') {
                embed.addField('Arguments', argumentString);
            }
            checkedSend(message.channel, embed);
            Logger.verbose(`Specific help sent in channel ${message.channel.id}`, LogOrigin.Discord);
        } else {
            const embed = this.maker.makeWarning();
            embed.title = 'Command not found';
            embed.description = `The command "${command}" does not exist.`;
            checkedSend(message.channel, embed);
            Logger.verbose(
                `Command not found while trying to send specific help in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        }
    }

    public get help(): string {
        return this._help;
    }

    public get args(): CommandArgs[] {
        return this._args;
    }
}
