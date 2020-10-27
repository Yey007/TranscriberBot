import { Message } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { DbGuildSettingsRespoitory } from "../repositories/guildsettings/dbguildsettingsrepository";
import { BotCommand } from "./botcommand";

@injectable()
export class SetTranscriptChannel extends BotCommand {

    private repo: DbGuildSettingsRespoitory

    public constructor(
        @inject(TYPES.GuildSettingsRepository) repo: DbGuildSettingsRespoitory) 
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
    public help(): string {
        return "sets a channel as the transcript channel"
    }

}