import { DMChannel, MessageEmbed, NewsChannel, TextChannel, User } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { StandardEmbedMaker } from "../misc/standardembedmaker";

@injectable()
export class TranscriptionSender {

    private maker: StandardEmbedMaker

    public constructor(
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker) 
    {
        this.maker = maker
    }


    public async send(user: User, transcriptChannel: TextChannel | DMChannel | NewsChannel, transcript: string): Promise<void> {
        transcriptChannel.send(this.format(user, transcript))
    }

    private format(user: User, transcript: string): MessageEmbed {
        let formatted = transcript

        //Trim
        formatted = formatted.trim()

        //Upcase first letter
        let firstChar = formatted[0]
        formatted = formatted.substr(1, formatted.length)
        formatted = firstChar.toUpperCase() + formatted

        //Replace hesitation markers
        formatted = formatted.replace("%HESITATION", "...")

        let embed = this.maker.makeInfo()
        embed.title = ""
        embed.setAuthor(user.username, user.avatarURL())

        embed.description = formatted
        return embed
    }
}