import { Collection, DMChannel, Message, User } from 'discord.js';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { RecordingPermissionState } from '../interface/misc/misctypes';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserSettingsRepository } from '../repositories/userrepo';
import { UserSettings } from '../../entity/usersettings';

@Service()
export class RecPermissionGetter {
    public constructor(@InjectRepository() private userSettingsRepo: UserSettingsRepository) {}

    public async getPermission(user: User): Promise<RecordingPermissionState> {
        const settings = await this.userSettingsRepo.findOneOrDefaults(user.id);

        switch (settings.permission) {
            case RecordingPermissionState.Consent:
            case RecordingPermissionState.NoConsent:
                Logger.verbose(`Found known recording permission for user with id ${user.id}`, LogOrigin.Transcription);
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
        await this.userSettingsRepo.save<UserSettings>({
            userId: user.id,
            permission: RecordingPermissionState.Unknown
        });

        let dm: DMChannel;
        try {
            dm = await user.createDM();
            await dm.send(
                "Hey! I'm currently transcribing audio from the voice channel you're in, but before I can transcribe your voice," +
                    ' I need your permission. Type `!accept` to accept and `!deny` to deny.'
            );
            Logger.verbose(
                `Asked for recording permission from user with id ${user.id}. Awaiting response...`,
                LogOrigin.Transcription
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
            await this.userSettingsRepo.save<UserSettings>({
                userId: user.id,
                permission: RecordingPermissionState.Consent
            });
            dm.send(`Preference set to \`${preference.slice(1)}\``);
            Logger.verbose(`Recieved accept message from user with id ${user.id}`, LogOrigin.Transcription);
            return RecordingPermissionState.Consent;
        } else {
            await this.userSettingsRepo.save<UserSettings>({
                userId: user.id,
                permission: RecordingPermissionState.NoConsent
            });
            dm.send(`Preference set to \`${preference.slice(1)}\``);
            Logger.verbose(`Recieved deny message from user with id ${user.id}`, LogOrigin.Transcription);
            return RecordingPermissionState.NoConsent;
        }
    }
}
