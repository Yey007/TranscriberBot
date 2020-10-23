import { User } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { AbstractPermissionRepository, PermissionState } from "../repositories/permission/abstractpermissionrepository";

@injectable()
export class PermissionGetter {

    private repo: AbstractPermissionRepository

    public constructor(
        @inject(TYPES.PermissionRepository) repo: AbstractPermissionRepository) 
    {
        this.repo = repo
    }

    public async getPermission(user: User, onResult: (accepted: boolean) => void) {
        switch (this.repo.get(user.id)) {
            case PermissionState.Consent:
                onResult(true)
                break;
            case PermissionState.NoConsent:
                onResult(false)
                break;
            case PermissionState.Unknown:
                if (user.bot) {
                    onResult(false)
                    break;
                }

                // Assume no consent for now so that we don't ask again
                this.repo.set(user.id, PermissionState.NoConsent)

                let dm = await user.createDM()
                let noconsent = false
                dm.send("Hey! I'm currently transcribing audio from the voice channel you're in, but before I can transcribe yours," +
                    " I need your permission. Type `!accept` to accept and `!refuse` to refuse")

                dm.awaitMessages(response => response.content === "!accept", {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(collected => {
                    this.repo.set(user.id, PermissionState.Consent)
                    dm.send("Permission preference set.")
                    onResult(true)
                }).catch(() => {
                    if (!noconsent) {
                        dm.send("Assumed no permission after 30 seconds.")
                        onResult(false)
                    }
                })

                dm.awaitMessages(response => response.content === "!refuse", {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(collected => {
                    noconsent = true
                    dm.send("Refused.")
                    onResult(false)
                }).catch(() => {

                })
                break;
        }
    }
}