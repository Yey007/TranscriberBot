import { User } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ConsentRepository, ConsentState } from "./consentrepository";

@injectable()
export class ConsentGetter {

    private repo: ConsentRepository

    public constructor(
        @inject(TYPES.ConsentRepository) repo: ConsentRepository) 
    {
        this.repo = repo
    }

    public async getconsent(user: User, onResult: (accepted: boolean) => void) {
        switch (this.repo.get(user.id)) {
            case ConsentState.Consent:
                onResult(true)
                break;
            case ConsentState.NoConsent:
                onResult(false)
                break;
            case ConsentState.Unknown:
                if (user.bot) {
                    onResult(false)
                    break;
                }

                // Assume no consent for now so that we don't ask again
                this.repo.set(user.id, ConsentState.NoConsent)

                let dm = await user.createDM()
                let noconsent = false
                dm.send("Hey! I'm currently transcribing audio from the voice channel you're in, but before I can transcribe yours," +
                    " I need your permission. Type `!consent` to accept and `!noconsent` to refuse")

                dm.awaitMessages(response => response.content === "!consent", {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(collected => {
                    this.repo.set(user.id, ConsentState.Consent)
                    dm.send("Consent preference set.")
                    onResult(true)
                }).catch(() => {
                    if (!noconsent) {
                        dm.send("Assumed no consent after 30 seconds.")
                        onResult(false)
                    }
                })

                dm.awaitMessages(response => response.content === "!noconsent", {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(collected => {
                    noconsent = true
                    dm.send("No consent.")
                    onResult(false)
                }).catch(() => {

                })
                break;
        }
    }
}