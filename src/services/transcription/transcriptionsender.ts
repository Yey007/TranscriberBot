import { DMChannel, GuildMember, MessageEmbed, NewsChannel, PartialGuildMember, TextChannel, User } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../misc/standardembedmaker";

@injectable()
export class TranscriptionSender {

    private maker: StandardEmbedMaker

    public constructor(
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker) {
        this.maker = maker
    }


    public async send(member: GuildMember | PartialGuildMember, transcriptChannel: TextChannel,
        voiceChannelName: string, transcript: string): Promise<void> {

        transcriptChannel.send(this.format(member, voiceChannelName, transcript))
    }

    private format(member: GuildMember | PartialGuildMember, voiceChannelName: string, transcript: string): MessageEmbed {
        let formatted = transcript

        //Trim
        formatted = formatted.trim()

        //Upcase first letter
        let firstChar = formatted[0]
        formatted = formatted.substr(1, formatted.length)
        formatted = firstChar.toUpperCase() + formatted

        //Replace hesitation markers
        formatted = formatted.replace(/%HESITATION/g, "...")

        let embed = this.maker.makeInfo()
        embed.title = ""
        embed.setAuthor(member.user.username, member.user.avatarURL())
        embed.setColor(member.displayHexColor)

        embed.description = formatted
        embed.setFooter(voiceChannelName)
        
        return embed
    }
}