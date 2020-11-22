import { Message } from "discord.js";
import { inject } from "inversify";
import { TYPES } from "../../../types";
import { StandardEmbedMaker } from "../../misc/standardembedmaker";
import { BotCommand } from "../botcommand";
import { CommandArgs } from "../commandargs";
import { MainCommandMapper } from "../commandmapper";

export class Help extends BotCommand {

    private mapper: MainCommandMapper
    private maker: StandardEmbedMaker
    private _help = "returns a list of commands"
    private _args: CommandArgs[] = [
        {name: "command", desc: "the command to give help about", optional: true}
    ]

    public constructor(
        @inject(TYPES.CommandMapper) mapper: MainCommandMapper,
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker) 
    {
        super()
        this.mapper = mapper
        this.maker = maker
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if(args[1]) {
            this.specificHelp(message, args[1])
        } else {
            this.genericHelp(message)
        }
    }

    private genericHelp(message: Message) {
        let e = this.maker.makeInfo()
        e.title = "Help"

        let commands = ""
        this.mapper.commands().sort((a, b) => {
            let [nameA] = a
            let [nameB] = b
            return nameA.localeCompare(nameB)
        }).forEach(([name, command]) => {
            commands += `\`${name}\` - ${command.help}\n`
        });
        e.addField("Commands", commands)

        e.addField("Addressing", `You can address the bot in two ways\n\n1. Mention the bot at the start of your message, like this: **${message.guild.me.toString()} command**\n2. Use the prefix (! by default), like this: **!command**`)

        message.channel.send(e)
    }

    private specificHelp(message: Message, command: string) {
        let cmd = this.mapper.map(command)
        if(cmd !== undefined) {
            let embed = this.maker.makeInfo()
            embed.title = "Help"

            //What the command does overall
            embed.description = `\`${command}\` ${cmd.help}
            Brackets [] denote optional arguments.`

            let usage = "`" + command //Argument order, which arguments are required etc.
            let argumentString = ""
            for(let arg of cmd.args) {
                usage += arg.optional ? ` [${arg.name}]`: ` ${arg.name}` //If optional surround with brackets
                argumentString += `\`${arg.name}\` - ${arg.desc}\n` //add name and description to list
            }
            usage += "`"

            embed.addField("Usage", usage)
            if(argumentString !== "") {
                embed.addField("Arguments", argumentString)
            }
            message.channel.send(embed)
            
        } else {
            let embed = this.maker.makeWarning()
            embed.title = "Command not found"
            embed.description = `The command "${command}" does not exist.`
            message.channel.send(embed)
        }
    }

    public get help(): string {
        return this._help
    }

    public get args(): CommandArgs[] {
        return this._args
    }
}