import { DMChannel, Message, NewsChannel, StringResolvable, TextChannel } from 'discord.js';

export async function checkedSend(
    channel: TextChannel | DMChannel | NewsChannel,
    content: StringResolvable
): Promise<Message> {
    if (channel instanceof DMChannel) {
        return await channel.send(content);
    }
    if (channel.permissionsFor(channel.guild.me).has('SEND_MESSAGES')) {
        return await channel.send(content);
    }
    return null;
}
