import { Message } from "discord.js"
import { inject, injectable } from "inversify"
import { TYPES } from "../../types"
import { CommandMapper } from "./commandmapper"
import { StandardEmbedMaker } from "../misc/standardembedmaker"
import { GuildSettings } from "../repositories/guildsettings/guildsettings"
import { SettingsRepository } from "../repositories/settingsrepository"

@injectable()
export class CommandExecutor {

    private maker: StandardEmbedMaker
    private mapper: CommandMapper
    private repo: SettingsRepository<GuildSettings>

    public constructor(
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker,
        @inject(TYPES.CommandMapper) mapper: CommandMapper,
        @inject(TYPES.GuildSettingsRepository) repo: SettingsRepository<GuildSettings>) 
    {
        this.maker = maker
        this.mapper = mapper
        this.repo = repo
    }

    public async executeCommand(message: Message) {
        
        if (message.author.bot || message.channel.type === "dm")
            return

        let settings = await this.repo.get(message.guild.id)
        let trimmed = ""
        if (message.content.startsWith(settings.prefix)) {
            trimmed = message.content.slice(settings.prefix.length, message.content.length)
        //Starts with mention
        } else if (message.content.startsWith(`<@${message.guild.me.user.id}>`) ||
            message.content.startsWith(`<@!${message.guild.me.user.id}>`)) {
            trimmed = message.content.slice(message.content.indexOf(" ") + 1, message.content.length)
        } else {
            return
        }

        let args = trimmed.split(" ")
        let cmd = this.mapper.map(args[0])
        if (cmd !== undefined) {
            if (args.length !== cmd.args.length + 1) {
                let argString = cmd.args.length === 1 ? "argument" : "arguments"
                let embed = this.maker.makeWarning()

                embed.title = "Invalid Arguments"
                embed.description = `That command requires ${cmd.args.length} ${argString} but you provided ${args.length - 1}.
                                    *Use \`about ${args[0]}\` for more information.*`

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