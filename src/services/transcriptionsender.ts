import { DMChannel, NewsChannel, TextChannel, User } from "discord.js";
import { injectable } from "inversify";

@injectable()
export class TranscriptionSender {

    public async send(user: User, transcriptChannel: TextChannel | DMChannel | NewsChannel, transcript: string): Promise<void> {
        let message = `[${user.username}] ` + this.format(transcript)
        transcriptChannel.send(message)
    }

    private format(transcript: string) {
        let ret = transcript

        //Trim
        ret = ret.trim()

        //Upcase first letter
        let firstChar = ret[0]
        ret = ret.substr(1, ret.length)
        ret = firstChar.toUpperCase() + ret

        //Replace hesitation markers
        ret = ret.replace("%HESITATION", "...")

        //Add period but make sure it's not weird if we already added a hesitation marker or something
        if(ret[ret.length - 1] !== ".") {
            ret = ret + "."
        }

        return ret
    }
}