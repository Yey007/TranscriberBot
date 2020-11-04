import { Message } from "discord.js";
import { inject } from "inversify";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../misc/standardembedmaker";
import { BotCommand } from "./botcommand";
import { CommandMapper } from "./commandmapper";

export class Help extends BotCommand {

    private mapper: CommandMapper
    private embed: StandardEmbedMaker
    private _help = "returns a list of commands"
    private _args: [string, string][] = []

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
        this.mapper.commands().forEach(([name, command]) => {
            e.description += `\`${name}\` - ${command.help}\n`
        });
        message.channel.send(e)
    }

    public get help(): string {
        return this._help
    }

    public get args(): [string, string][] {
        return this._args
    }
    
}