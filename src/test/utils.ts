import { Collection, Message, MessageEmbed } from 'discord.js';
import { expect } from 'chai';
import { botMember, channel, prefix, selfVoiceChannel } from './setup';

export function expectMessage(expected: string | MessageEmbed): Promise<void | Collection<string, Message>> {
    return channel
        .awaitMessages((x) => x.author.id === botMember.user.id, {
            max: 1
        })
        .then((collected) => {
            const msg = collected.first();
            if (expected instanceof MessageEmbed) {
                const actual = msg.embeds[0];
                expect(actual).to.deep.equal(expected);
            } else {
                expect(msg.content).to.equal(expected);
            }
        });
}

export function sendCommand(command: string): Promise<Message> {
    return channel.send(prefix + command);
}

export const COLORS = {
    Info: 0x469fe0,
    Success: 0x55ab46,
    Error: 0x9e3f3f,
    Warning: 0xdeb900
};

export async function awaitChannelLeave(): Promise<void> {
    while (selfVoiceChannel.members.has(botMember.user.id)) {
        await sleep(100); //dies if this isn't here
    }
    await sleep(1000);
}

export async function awaitChannelJoin(): Promise<void> {
    while (!selfVoiceChannel.members.has(botMember.user.id)) {
        await sleep(100); //dies if this isn't here
    }
    await sleep(1000);
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
