import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import { UserSettings } from '../../entity/usersettings';
import { RecordingPermissionState } from '../interface/misc/misctypes';
import { DefaultedRepository } from './defaultrepo';

@Service()
@EntityRepository(UserSettings)
export class UserSettingsRepository extends DefaultedRepository<UserSettings> {
    getDefaults(): UserSettings {
        const settings = new UserSettings();
        settings.userId = undefined;
        settings.permission = RecordingPermissionState.Unknown;
        return settings;
    }
}
