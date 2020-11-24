import { botVoiceChannel, selfMember, selfVoiceChannel } from "."
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
            await sendCommand("leave")
            await awaitChannelLeave()
        })
    })

    context("when self not in channel", () => {
        it("should leave voice channel", async () => {
            await selfMember.voice.setChannel(null)
            await sendCommand("leave")
            await awaitChannelLeave()
        })
    })
})

