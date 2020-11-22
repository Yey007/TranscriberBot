import { strict } from "assert";
import { Collection, Message, MessageEmbed } from "discord.js";
import { channel, otherBotId } from "./index"
import { expect } from "chai"

export function expectMessage(expected: string | MessageEmbed): Promise<void | Collection<string, Message>> {
    return channel.awaitMessages(x => x.author.id === otherBotId, {
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