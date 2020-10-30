import { Guild, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { AbstractGuildSettingsRepository } from "../repositories/guildsettings/abstractguildsettingsrepository";
import { GuildSettings } from "../repositories/guildsettings/guildsettings";

@injectable()
export class TranscriptionChannelGetter {

    private guildSettingsRepo: AbstractGuildSettingsRepository

    public constructor(
        @inject(TYPES.GuildSettingsRepository) guildSettingsRepo: AbstractGuildSettingsRepository) 
    {
        this.guildSettingsRepo = guildSettingsRepo
    }

    public get(guild: Guild, onResult: (channel: TextChannel) => void): void
    {
        this.guildSettingsRepo.get(guild.id, function(settings: GuildSettings) {
            if(settings.transcriptionChannelId !== undefined) {
                let chan = guild.channels.cache.get(settings.transcriptionChannelId) as TextChannel
                if(chan !== null) {
                    onResult(chan)
                    return
                }
            }

            // This may not exist, but this function can't deal with it at that point.
            let chan = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
            onResult(chan as TextChannel)
        })
    }
}