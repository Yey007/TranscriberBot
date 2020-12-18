import { Collection, DMChannel, Message, User } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { SettingsRepository } from '../repositories/settingsrepository';
import { RecordingPermissionState, UserSettings } from '../repositories/usersettings/usersettings';

@injectable()
export class RecPermissionGetter {
    private permissionRepo: SettingsRepository<UserSettings>;

    public constructor(@inject(TYPES.UserSettingsRepository) userSettingsRepo: SettingsRepository<UserSettings>) {
        this.permissionRepo = userSettingsRepo;
    }

    public async getPermission(user: User): Promise<RecordingPermissionState> {
        const settings = await this.permissionRepo.get(user.id);

        switch (settings.permission) {
            case RecordingPermissionState.Consent:
            case RecordingPermissionState.NoConsent:
                Logger.verbose(`Found know recording permission for user with id ${user.id}`, LogOrigin.Transcription);
                return settings.permission;
            case RecordingPermissionState.Unknown:
                Logger.verbose(
                    `Found unknown recording permission for user with id ${user.id}`,
                    LogOrigin.Transcription
                );
                return await this.askUser(user);
        }
    }

    private async askUser(user: User): Promise<RecordingPermissionState> {
        await this.permissionRepo.set(user.id, { permission: RecordingPermissionState.NoConsent });

        let dm: DMChannel;
        try {
            dm = await user.createDM();
            dm.send(
                "Hey! I'm currently transcribing audio from the voice channel you're in, but before I can transcribe your voice," +
                    ' I need your permission. Type `!accept` to accept and `!deny` to deny.'
            );
            Logger.verbose(
                `Asked for recording permission from user with id ${user.id}. Awaiting response...`,
                LogOrigin.MySQL
            );
        } catch (err: unknown) {
            if (err instanceof Error) {
                Logger.warn(
                    `Error asking for recording permission from user with id ${user.id}: ${err.message}`,
                    LogOrigin.Transcription
                );
            } else {
                Logger.warn(
                    `Error asking for recording permission from user with id ${user.id}: ${err}`,
                    LogOrigin.Transcription
                );
            }

            return RecordingPermissionState.NoConsent;
        }

        let collected: Collection<string, Message>;
        try {
            collected = await dm.awaitMessages(
                (response) => response.content === '!accept' || response.content === '!deny',
                {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }
            );
        } catch (error) {
            dm.send('Assumed no permission after 30 seconds.');
            Logger.verbose(`No accept or deny message recieved from user with id ${user.id}`, LogOrigin.Transcription);
            return RecordingPermissionState.NoConsent;
        }

        const preference = collected.first().content;
        if (preference === '!accept') {
            this.permissionRepo.set(user.id, { permission: RecordingPermissionState.Consent });
            dm.send(`Preference set to \`${preference.slice(1)}\``);
            Logger.verbose(`Recieved accept message from user with id ${user.id}`, LogOrigin.Transcription);
            return RecordingPermissionState.Consent;
        } else {
            this.permissionRepo.set(user.id, { permission: RecordingPermissionState.NoConsent });
            dm.send(`Preference set to \`${preference.slice(1)}\``);
            Logger.verbose(`Recieved deny message from user with id ${user.id}`, LogOrigin.Transcription);
            return RecordingPermissionState.NoConsent;
        }
    }
}
