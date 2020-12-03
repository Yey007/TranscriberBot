import { botMember, selfMember, selfVoiceChannel } from "."
import { awaitChannelJoin, sendCommand } from "./utils"

describe("Join", () => {

    before(async () => {
        await selfVoiceChannel.join()
    })

    it("should join voice channel of bot", async () => { 
        let promise = awaitChannelJoin()
        await sendCommand("join")
        await promise
    })

    after(async () => {
        //Kick bot
        await botMember.voice.setChannel(null)

        //Kick self
        await selfMember.voice.setChannel(null)
    })
})