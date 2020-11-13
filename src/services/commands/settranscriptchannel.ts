import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../misc/standardembedmaker";
import { managerRequired } from "../permissions/rolerequierments";
import { GuildSettings } from "../repositories/guildsettings/guildsettings";
import { SettingsRepository } from "../repositories/settingsrepository";
import { BotCommand } from "./botcommand";

@injectable()
export class SetTranscriptChannel extends BotCommand {

    private repo: SettingsRepository<string>
    private maker: StandardEmbedMaker
    private _help = "sets the transcription channel for a discord server as the current channel"
    private _args: [string, string][] = [
        ["voiceChannel", "the name of the voice channel that should be transcribed into this channel."]
    ]

    public constructor(
        @inject(TYPES.TranscriptionChannelRespository) repo: SettingsRepository<string>,
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker) 
    {
        super()
        this.repo = repo
        this.maker = maker
    }

    @managerRequired
    public async execute(message: Message, args: string[]): Promise<void> {
        let vc = message.guild.channels.cache.find(x => x.name === args[1] && x.type === "voice")
        if(vc !== undefined) {
            this.repo.set(vc.id, message.channel.id)
            let embed = this.maker.makeSuccess()
            embed.description = `Set the transcription channel for \`${args[1]}\` to this channel`
            message.channel.send(embed)
        } else {
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