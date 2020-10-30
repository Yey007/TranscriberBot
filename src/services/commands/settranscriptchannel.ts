import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { AbstractGuildSettingsRepository } from "../repositories/guildsettings/abstractguildsettingsrepository";
import { BotCommand } from "./botcommand";

@injectable()
export class SetTranscriptChannel extends BotCommand {

    private repo: AbstractGuildSettingsRepository
    private _help = "sets the transcription channel for a discord server as the current channel"
    private _args: [string, string][] = []

    public constructor(
        @inject(TYPES.GuildSettingsRepository) repo: AbstractGuildSettingsRepository) 
    {
        super()
        this.repo = repo
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        // Yes, this could be better. No, I'm not gonna fix it now.
        this.repo.get(message.guild.id, (settings) => {
            if(settings !== undefined) {
                settings.transcriptionChannelId = message.channel.id
                this.repo.set(message.guild.id, settings)
            } else {
                this.repo.set(message.guild.id, {transcriptionChannelId: message.channel.id})
            }
        })
    }
    
    public get help(): string {
        return this._help
    }

    public get args(): [string, string][] {
        return this._args
    }

}