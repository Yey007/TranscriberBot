import { botMember, botVoiceChannel, selfMember, selfVoiceChannel } from "."
import { awaitChannelLeave, sendCommand } from "./utils"

describe("Leave", () => {

    before(async () => {
        await selfVoiceChannel.join()
    })

    beforeEach(async () => {
        await botVoiceChannel.join()
    })

    context("when self in channel", () => {
        it("should leave voice channel", async () => {
            let promise = awaitChannelLeave()
            await sendCommand("leave")
            await promise
        })
    })

    context("when self not in channel", () => {
        it("should leave voice channel", async () => {
            selfVoiceChannel.leave()
            let promise = awaitChannelLeave()
            await sendCommand("leave")
            await promise
        })
    })

    after(async () => {
        //Kick bot
        await botMember.voice.setChannel(null)

        //Kick self
        await selfMember.voice.setChannel(null)
    })
})

