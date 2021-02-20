import { GuildMember, MessageEmbed, PartialGuildMember, TextChannel } from 'discord.js';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { StandardEmbedMaker } from '../interface/misc/standardembedmaker';
import { Service } from 'typedi';
import { checkedSend } from '../interface/misc/checkedsend';

@Service()
export class TranscriptionSender {
    public constructor(private maker: StandardEmbedMaker) {}

    public async send(
        member: GuildMember | PartialGuildMember,
        transcriptChannel: TextChannel,
        voiceChannelName: string,
        transcript: string
    ): Promise<void> {
        await checkedSend(transcriptChannel, this.format(member, voiceChannelName, transcript));
        Logger.verbose(
            `Sent transcription in transcription channel with id ${transcriptChannel.id}`,
            LogOrigin.Discord
        );
    }

    private format(
        member: GuildMember | PartialGuildMember,
        voiceChannelName: string,
        transcript: string
    ): MessageEmbed {
        let formatted = transcript;

        //Trim
        formatted = formatted.trim();

        //Upcase first letter
        const firstChar = formatted[0];
        formatted = formatted.substr(1, formatted.length);
        formatted = firstChar.toUpperCase() + formatted;

        //Replace hesitation markers
        formatted = formatted.replace(/%HESITATION/g, '...');
        formatted = formatted.replace(/\*/g, '\\*');

        const embed = this.maker.makeInfo();
        embed.title = '';
        embed.setAuthor(member.user.username, member.user.avatarURL());
        embed.setColor(member.displayHexColor);

        embed.description = formatted;
        embed.setFooter(voiceChannelName);

        embed.setTimestamp(Date.now());

        return embed;
    }
}
