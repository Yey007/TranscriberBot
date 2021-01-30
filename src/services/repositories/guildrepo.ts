import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import { GuildSettings } from '../../entity/guildsettings';
import { DefaultedRepository } from './defaultrepo';

@Service()
@EntityRepository(GuildSettings)
export class GuildSettingsRepository extends DefaultedRepository<GuildSettings> {
    getDefaults(): GuildSettings {
        const settings = new GuildSettings();
        settings.guildId = undefined;
        settings.prefix = '!';
        return settings;
    }
}
