import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../misc/standardembedmaker";
import { AbstractGuildSettingsRepository } from "../repositories/guildsettings/abstractguildsettingsrepository";
import { BotCommand } from "./botcommand";

@injectable()
export class SetPrefix extends BotCommand {

    private repo: AbstractGuildSettingsRepository
    private maker: StandardEmbedMaker

    private _help = "sets this bot's prefix for this server"
    private _args: [string, string][] = [
        ["prefix", "the prefix this bot should use for commands"]
    ]

    public constructor(
        @inject(TYPES.GuildSettingsRepository) repo: AbstractGuildSettingsRepository,
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker) 
    {
        super()
        this.repo = repo
        this.maker = maker
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if(args[1].length > 5) {
            let embed = this.maker.makeWarning()
            embed.description = "Prefix cannot be more than 5 characters."
            message.channel.send(embed)
            return
        }
        this.repo.set(message.guild.id, {prefix: args[1]})
        let embed = this.maker.makeSuccess()
        embed.description = `Prefix set to \`${args[1]}\``
        message.channel.send(embed)
    }
    public get help(): string {
        return this._help
    }
    public get args(): [string, string][] {
        return this._args
    }

}