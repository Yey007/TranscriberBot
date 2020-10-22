import { User } from "discord.js";
import { injectable } from "inversify";

@injectable()
export class ConsentGetter {
    public async getconsent(user: User, onuserconsent: () => void) {
        if (!user.bot) {
            let dm = await user.createDM()
            let noconsent = false
            dm.send("Hey! I'm currently transcribing audio from the voice channel you're in, but before I can transcribe yours," +
                " I need your permission. Type `!consent` to accept and `!noconsent` to refuse")

            dm.awaitMessages(response => response.content === "!consent", {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {
                onuserconsent()
            }).catch(() => {
                if (!noconsent) {
                    dm.send("Assumed no consent after 30 seconds.")
                }
            })

            dm.awaitMessages(response => response.content === "!noconsent", {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {
                noconsent = true
                dm.send("No consent.")
            }).catch(() => {
                
            })
        }
    }
}