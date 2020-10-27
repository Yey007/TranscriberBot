import { Message } from "discord.js";
import { inject } from "inversify";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../misc/standardembedmaker";
import { BotCommand } from "./botcommand";
import { CommandMapper } from "./commandmapper";

export class Commands extends BotCommand {

    private mapper: CommandMapper
    private embed: StandardEmbedMaker

    public constructor(
        @inject(TYPES.CommandMapper) mapper: CommandMapper,
        @inject(TYPES.StandardEmbedMaker) embed: StandardEmbedMaker) 
    {
        super()
        this.mapper = mapper
        this.embed = embed
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        let e = this.embed.makeInfo()
        e.title = "Commands"
        e.description = ""
        this.mapper.commands().forEach(([name, command]) => {
            e.description += `\`${name}\` - ${command.help()}\n`
        });
        message.channel.send(e)
    }
    public help(): string {
        return "returns a list of commands"
    }
    
}