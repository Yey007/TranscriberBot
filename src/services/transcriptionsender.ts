import { Channel, User } from "discord.js";

export class TranscriptionSender {

    public async send(user: User, transcriptChannel: Channel, transcript: string): Promise<void> {
        let message = `[${user.username}] ` + this.format(transcript)
    }

    private format(transcript: string) {
        let ret = transcript
        let firstChar = ret[0]

        ret = ret.substr(1, ret.length)
        ret = firstChar.toUpperCase() + ret
        ret = ret + "."

        ret = ret.replace("%HESITATION", "...")

        return ret
    }
}