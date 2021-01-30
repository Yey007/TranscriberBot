import { Collection, Message, MessageEmbed } from 'discord.js';
import { expect } from 'chai';
import { botMember, channel, prefix, selfClient, selfVoiceChannel } from './setup';
import { getConnection } from 'typeorm';

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

export function cleanUpInit(): void {
    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));

    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}

function exitHandler(options: { cleanup?: boolean; exit?: boolean }) {
    if (options.cleanup) {
        selfClient.destroy();
    }
    if (options.exit) process.exit();
}

export async function clearDb(): Promise<void> {
    const connection = getConnection();
    await connection.synchronize(true);
}
