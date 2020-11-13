import { User } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { SettingsRepository } from "../repositories/settingsrepository";
import { RecordingPermissionState, UserSettings } from "../repositories/usersettings/usersettings";

@injectable()
export class PermissionGetter {

    private permissionRepo: SettingsRepository<UserSettings>

    public constructor(
        @inject(TYPES.UserSettingsRepository) userSettingsRepo: SettingsRepository<UserSettings>) 
    {
        this.permissionRepo = userSettingsRepo
    }

    public async getPermission(user: User): Promise<RecordingPermissionState> {
        if (user.bot) {
            return RecordingPermissionState.NoConsent
        }
        
        let settings = await this.permissionRepo.get(user.id)
        
        switch (settings.permission) {
            case RecordingPermissionState.Consent:
            case RecordingPermissionState.NoConsent:
                return settings.permission
            case RecordingPermissionState.Unknown:
                return await this.askUser(user)
        }
    }

    private async askUser(user: User): Promise<RecordingPermissionState> {
        await this.permissionRepo.set(user.id, {permission: RecordingPermissionState.NoConsent})

        let dm = await user.createDM()
        dm.send("Hey! I'm currently transcribing audio from the voice channel you're in, but before I can transcribe your voice," +
            " I need your permission. Type `!accept` to accept and `!deny` to deny.")

        try {
            let collected = await dm.awaitMessages(response => 
                response.content === "!accept" || response.content === "!deny", {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                })
            let preference = collected.first().content
            if(preference === "!accept") {
                this.permissionRepo.set(user.id, {permission: RecordingPermissionState.Consent})
                dm.send(`Preference set to \`${preference}\``)
                return RecordingPermissionState.Consent
            } else {
                this.permissionRepo.set(user.id, {permission: RecordingPermissionState.NoConsent})
                dm.send(`Preference set to \`${preference}\``)
                return RecordingPermissionState.NoConsent
            }
        } catch(error) {
            dm.send("Assumed no permission after 30 seconds.")
            return RecordingPermissionState.NoConsent
        }
    }
}