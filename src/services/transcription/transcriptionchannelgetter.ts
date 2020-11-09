import { Guild, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";import { GuildSettings } from "../repositories/guildsettings/guildsettings";
import { SettingsRepository } from "../repositories/settingsrepository";

@injectable()
export class TranscriptionChannelGetter {

    private transcriptionChannelRepo: SettingsRepository<string>

    public constructor(
        @inject(TYPES.TranscriptionChannelRespository) transcriptionChannelRepo: SettingsRepository<string>) 
    {
        this.transcriptionChannelRepo = transcriptionChannelRepo
    }

    public async get(guild: Guild, vcId: string): Promise<TextChannel>
    {
        let textId = await this.transcriptionChannelRepo.get(vcId)

        let chan = guild.channels.cache.get(textId)
        if (chan !== null)
            return chan as TextChannel

        // This may not exist, but this function can't deal with it at that point.
        chan = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        return chan as TextChannel
    }
}