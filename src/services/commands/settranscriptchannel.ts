import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { AbstractGuildSettingsRepository } from "../repositories/guildsettings/abstractguildsettingsrepository";
import { BotCommand } from "./botcommand";

@injectable()
export class SetTranscriptChannel extends BotCommand {

    private repo: AbstractGuildSettingsRepository
    private _help = "sets the transcription channel for a discord server as the current channel"
    private _args: [string, string][] = [
        ["voiceChannel", "the name of the voice channel that should be transcribed into this channel."]
    ]

    public constructor(
        @inject(TYPES.GuildSettingsRepository) repo: AbstractGuildSettingsRepository) 
    {
        super()
        this.repo = repo
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        let vc = message.guild.channels.cache.find(x => x.name === args[1])
        if(vc !== undefined) {
            this.repo.set(message.guild.id, {transcriptChannels: new Map([[vc.id, message.channel.id]])})
        } else {
            //TODO: rejection logic here
        }
    }
    
    public get help(): string {
        return this._help
    }

    public get args(): [string, string][] {
        return this._args
    }

}