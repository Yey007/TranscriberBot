import { Collection, Message, MessageEmbed } from "discord.js";
import { botMember, channel, selfClient, prefix, selfVoiceChannel } from "./index"
import { expect } from "chai"

export function expectMessage(expected: string | MessageEmbed): Promise<void | Collection<string, Message>> {
    return channel.awaitMessages(x => x.author.id === botMember.user.id, {
        max: 1
    }).then((collected) => {
        let msg = collected.first()
        if (expected instanceof MessageEmbed) {
            let actual = msg.embeds[0]
            expect(expected).to.deep.equal(actual)
        } else {
            expect(expected).to.equal(msg.content)
        }
    })
}

export function sendCommand(command: string) {
    return channel.send(prefix + command)
}

export const COLORS = {
    Info: 0x469fe0,
    Success: 0x55ab46,
    Error: 0x9e3f3f,
    Warning: 0xdeb900
}

export async function awaitChannelLeave() {
    while(selfVoiceChannel.members.has(botMember.user.id)) {
        await sleep(100) //dies if this isn't here
    }
    await sleep(1000)
}

export async function awaitChannelJoin() {
    while(!selfVoiceChannel.members.has(botMember.user.id)) {
        await sleep(100) //dies if this isn't here
    }
    await sleep(1000)
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}