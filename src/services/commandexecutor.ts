import { Message } from "discord.js"
import { inject, injectable } from "inversify"
import { TYPES } from "../types"
import { CommandMapper } from "./commandmapper"

@injectable()
export class CommandExecutor {

    private mapper: CommandMapper

    public constructor(
        @inject(TYPES.CommandMapper) mapper: CommandMapper) 
    {
        this.mapper = mapper
    }

    public executecommand(message: Message) {
        if (message.content.startsWith("!")) 
        {
            message.content = message.content.slice(1, message.content.length)
            let args = message.content.split(" ")
            let cmd = this.mapper.map(args[0])
            cmd.execute(message, args)
        }
    }
}