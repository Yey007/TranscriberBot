import { User } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { AbstractPermissionRepository } from "../repositories/permission/abstractpermissionrepository";
import { RecordingPermissionState } from "../repositories/permission/usersettings";

@injectable()
export class PermissionGetter {

    private permissionRepo: AbstractPermissionRepository

    public constructor(
        @inject(TYPES.PermissionRepository) permissionRepo: AbstractPermissionRepository) 
    {
        this.permissionRepo = permissionRepo
    }

    public async getPermission(user: User): Promise<RecordingPermissionState> {
        let settings = await this.permissionRepo.get(user.id)
        if (user.bot) {
            return RecordingPermissionState.NoConsent
        }
        switch (settings.recPermState) {
            case RecordingPermissionState.Consent:
            case RecordingPermissionState.NoConsent:
                return settings.recPermState
            case RecordingPermissionState.Unknown:

                // Assume no consent for now so that we don't ask again
                // There is a low chance that this will cause a datarace
                settings.recPermState = RecordingPermissionState.NoConsent
                this.permissionRepo.set(user.id, settings)

                let dm = await user.createDM()
                let noconsent = false
                dm.send("Hey! I'm currently transcribing audio from the voice channel you're in, but before I can transcribe yours," +
                    " I need your permission. Type `!accept` to accept and `!refuse` to refuse")

                dm.awaitMessages(response => response.content === "!accept", {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(async collected => {
                    settings = await this.permissionRepo.get(user.id)
                    settings.recPermState = RecordingPermissionState.Consent
                    this.permissionRepo.set(user.id, settings)
                    dm.send("Permission preference set.")
                    return RecordingPermissionState.Consent
                }).catch(() => {
                    if (!noconsent) {
                        dm.send("Assumed no permission after 30 seconds.")
                        return RecordingPermissionState.NoConsent
                    }
                })

                dm.awaitMessages(response => response.content === "!refuse", {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(collected => {
                    noconsent = true
                    dm.send("Refused.")
                    return RecordingPermissionState.NoConsent
                }).catch(() => {

                })
                break;
        }
    }
}