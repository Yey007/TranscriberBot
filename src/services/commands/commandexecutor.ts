import { Message } from "discord.js"
import { inject, injectable } from "inversify"
import { TYPES } from "../../types"
import { CommandMapper } from "./commandmapper"
import { StandardEmbedMaker } from "../misc/standardembedmaker"
import { AbstractGuildSettingsRepository } from "../repositories/guildsettings/abstractguildsettingsrepository"

@injectable()
export class CommandExecutor {

    private maker: StandardEmbedMaker
    private mapper: CommandMapper
    private repo: AbstractGuildSettingsRepository

    public constructor(
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker,
        @inject(TYPES.CommandMapper) mapper: CommandMapper,
        @inject(TYPES.GuildSettingsRepository) repo: AbstractGuildSettingsRepository ) 
    {
        this.maker = maker
        this.mapper = mapper
        this.repo = repo
    }

    public async executeCommand(message: Message) {
        
        if (message.author.bot || message.channel.type === "dm") 
            return

        let settings = await this.repo.get(message.guild.id)
        if(!message.content.startsWith(settings.prefix))
            return

        let trimmed = message.content.slice(settings.prefix.length, message.content.length)
        let args = trimmed.split(" ")
        let cmd = this.mapper.map(args[0])
        if(cmd !== undefined) {
            if(args.length < cmd.args.length + 1) {
                let embed = this.maker.makeWarning()
                embed.title = "Invalid Arguments"
                embed.description = `That command requires ${cmd.args.length + 1} arguments but you provided ${args.length}.`
                message.channel.send(embed)
                return
            }
            cmd.execute(message, args)
        } else {
            let embed = this.maker.makeWarning()
            embed.title = "Command not found"
            embed.description = `The command "${args[0]}" does not exist.`
            message.channel.send(embed)
        }
        
    }
}