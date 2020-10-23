import { MessageEmbed } from "discord.js";
import { injectable } from "inversify";

@injectable()
export class StandardEmbedMaker {

    //Embeds come with standard titles and colors, although titles are likely to be replaced.

    public makeInfo(): MessageEmbed {
        let embed = new MessageEmbed()
        embed.title = "Info"
        embed.color = 0x469fe0
        return embed
    }

    public makeSuccess(): MessageEmbed {
        let embed = new MessageEmbed()
        embed.title = "Success"
        embed.color = 0x55ab46
        return embed
    }

    public makeError(): MessageEmbed {
        let embed = new MessageEmbed()
        embed.title = "Error"
        embed.color = 0x9e3f3f
        return embed
    }

    public makeWarning(): MessageEmbed {
        let embed = new MessageEmbed()
        embed.title = "Warning"
        embed.color = 0xdeb900
        return embed
    }
}