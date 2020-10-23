import { Message } from "discord.js"
import { inject, injectable } from "inversify"
import { TYPES } from "../types"
import { CommandMapper } from "./commandmapper"
import { StandardEmbedMaker } from "./standardembedmaker"

@injectable()
export class CommandExecutor {

    private maker: StandardEmbedMaker
    private mapper: CommandMapper

    public constructor(
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker,
        @inject(TYPES.CommandMapper) mapper: CommandMapper) 
    {
        this.maker = maker
        this.mapper = mapper
    }

    public executeCommand(message: Message) {
        if (message.content.startsWith("!") && message.channel.type !== "dm") 
        {
            message.content = message.content.slice(1, message.content.length)
            let args = message.content.split(" ")
            let cmd = this.mapper.map(args[0])
            if(cmd !== undefined) {
                cmd.execute(message, args)
            } else {
                let embed = this.maker.makeWarning()
                embed.title = "Command not found"
                embed.description = `The command "${args[1]}" does not exist.`
                message.channel.send(embed)
            }
        }
    }
}