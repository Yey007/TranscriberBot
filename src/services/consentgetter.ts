import { Collection, Guild, GuildMember, User } from "discord.js";
import { injectable } from "inversify";

@injectable()
export class ConsentGetter {
    public async getconsent(members: IterableIterator<GuildMember>, onuserconsent: (member: GuildMember) => void) {
        for (const member of members) {
            if (!member.user.bot) {
                let dm = await member.createDM()
                await dm.send("Consent?")
                dm.awaitMessages(response => response.content === "!consent", {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(collected => {
                    onuserconsent(member)
                }).catch(() => {
                    dm.send("Assumed no consent after 30 seconds.")
                })
            }
        }
    }
}