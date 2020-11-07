import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../misc/standardembedmaker";
import { AbstractGuildSettingsRepository } from "../repositories/guildsettings/abstractguildsettingsrepository";
import { GuildSettings } from "../repositories/guildsettings/guildsettings";
import { BotCommand } from "./botcommand";

@injectable()
export class SetTranscriptChannel extends BotCommand {

    private repo: AbstractGuildSettingsRepository
    private maker: StandardEmbedMaker
    private _help = "sets the transcription channel for a discord server as the current channel"
    private _args: [string, string][] = [
        ["voiceChannel", "the name of the voice channel that should be transcribed into this channel."]
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
        let vc = message.guild.channels.cache.find(x => x.name === args[1] && x.type === "voice")
        if(vc !== undefined) {
            let settings: GuildSettings = {transcriptChannels: new Map([[vc.id, message.channel.id]])}
            this.repo.set(message.guild.id, settings)

            let embed = this.maker.makeSuccess()
            embed.description = `Set the transcription channel for \`${args[1]}\` to this channel`
            message.channel.send(embed)
        } else {
            //TODO: rejection logic here
            let embed = this.maker.makeWarning()
            embed.description = `Voice channel \`${args[1]}\` not found`
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