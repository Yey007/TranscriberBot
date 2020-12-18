import { Guild, Role } from 'discord.js';
import { injectable } from 'inversify';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';

@injectable()
export class RoleManager {
    public readonly roleName = 'TranscriberBot Manager';

    public create(guild: Guild): Promise<Role> {
        const role = guild.roles.cache.find((role) => role.name === this.roleName);
        if (!role) {
            Logger.verbose(`Creating manager role in guild with id ${guild.id}`, LogOrigin.Discord);
            return guild.roles.create({
                data: {
                    name: this.roleName,
                    color: 0x4399b5,
                    position: 0,
                    mentionable: false
                }
            });
        }
        Logger.verbose(
            `Found existing manager role, returning that instead of creating a new one for guild with id ${guild.id}`,
            LogOrigin.Discord
        );
        return new Promise((resolutionFunc: (role: Role) => void) => {
            resolutionFunc(role);
        });
    }
}
