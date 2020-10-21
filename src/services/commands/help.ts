import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { CommandMapper } from "../commandmapper";
import { StandardEmbedMaker } from "../standardembedmaker";
import { BotCommand } from "./botcommand";

@injectable()
export class HelpSender extends BotCommand {

    private maker: StandardEmbedMaker
    private mapper: CommandMapper

    public constructor(
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker,
        @inject(TYPES.CommandMapper) mapper: CommandMapper) 
    {
        super()
        this.maker = maker
        this.mapper = mapper
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        let cmd = this.mapper.map(args[1])
        if(cmd !== undefined) {
            let embed = this.maker.makeInfo()
            embed.title = "Help"
            embed.description = `${args[1][0].toUpperCase() + args[1].slice(1, args[1].length)} ${cmd.help()}`
            message.channel.send(embed)
        } else {
            let embed = this.maker.makeWarning()
            embed.title = "Command not found"
            embed.description = `The command "${args[1]}" does not exist.`
            message.channel.send(embed)
        }
    }
    
    public help(): string {
        return "gives help about a command"
    }

    
}