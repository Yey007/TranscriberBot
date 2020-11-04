import { Guild, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { AbstractGuildSettingsRepository } from "../repositories/guildsettings/abstractguildsettingsrepository";

@injectable()
export class TranscriptionChannelGetter {

    private guildSettingsRepo: AbstractGuildSettingsRepository

    public constructor(
        @inject(TYPES.GuildSettingsRepository) guildSettingsRepo: AbstractGuildSettingsRepository) 
    {
        this.guildSettingsRepo = guildSettingsRepo
    }

    public async get(guild: Guild, vcId: string): Promise<TextChannel>
    {
        let settings = await this.guildSettingsRepo.get(guild.id)

        if (settings.transcriptChannels !== undefined) {
            let tcId = settings.transcriptChannels.get(vcId)
            if(tcId !== undefined) {
                let chan = guild.channels.cache.get(tcId) as TextChannel
                if (chan !== null) {
                    return chan
                }
            }
        }

        // This may not exist, but this function can't deal with it at that point.
        let chan = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        return chan as TextChannel
    }
}