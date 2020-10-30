import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CommandMapper } from "./commandmapper";
import { StandardEmbedMaker } from "../misc/standardembedmaker";
import { BotCommand } from "./botcommand";

@injectable()
export class HelpSender extends BotCommand {

    private embedMaker: StandardEmbedMaker
    private mapper: CommandMapper
    private _help = "gives help about a command"
    private _args: [string, string][] = [["command", "the command to give help about"]]

    public constructor(
        @inject(TYPES.StandardEmbedMaker) embedMaker: StandardEmbedMaker,
        @inject(TYPES.CommandMapper) mapper: CommandMapper) 
    {
        super()
        this.embedMaker = embedMaker
        this.mapper = mapper
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        let cmd = this.mapper.map(args[1])
        if(cmd !== undefined) {
            let embed = this.embedMaker.makeInfo()
            embed.title = "Help"
            embed.description = `\`${args[1]}\` ${cmd.help}`

            let usage = "`" + args[1]
            let argumentString = ""
            for(let [argName, argDesc] of cmd.args) {
                usage += ` ${argName}`
                argumentString += `\`${argName}\` - ${argDesc}\n`
            }
            usage += "`"

            embed.addField("Usage", usage)
            if(argumentString !== "") {
                embed.addField("Arguments", argumentString)
            }
            message.channel.send(embed)

        } else {
            let embed = this.embedMaker.makeWarning()
            embed.title = "Command not found"
            embed.description = `The command "${args[1]}" does not exist.`
            message.channel.send(embed)
        }
    }
    
    public get help(): string {
        return this._help
    }

    public get args(): [string, string][] {
        return this._args
    }
    
}