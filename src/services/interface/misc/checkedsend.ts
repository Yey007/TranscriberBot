import { DMChannel, Message, NewsChannel, StringResolvable, TextChannel } from 'discord.js';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';

export async function checkedSend(
    channel: TextChannel | DMChannel | NewsChannel,
    content: StringResolvable
): Promise<Message> {
    if (channel instanceof DMChannel) {
        return await channel.send(content);
    }
    if (channel.permissionsFor(channel.guild.me).has('SEND_MESSAGES')) {
        Logger.verbose(`Sending message to channel with id ${channel.id}`, LogOrigin.Discord);
        return await channel.send(content);
    }
    return null;
}
