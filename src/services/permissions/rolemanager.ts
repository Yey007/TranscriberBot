import { Guild, Role } from 'discord.js';
import { injectable } from 'inversify';

@injectable()
export class RoleManager {
    public readonly roleName = 'TranscriberBot Manager';

    public create(guild: Guild): Promise<Role> {
        const role = guild.roles.cache.find((role) => role.name === this.roleName);
        if (!role) {
            return guild.roles.create({
                data: {
                    name: this.roleName,
                    color: 0x4399b5,
                    position: 0,
                    mentionable: false
                }
            });
        }
        return new Promise((resolutionFunc: (role: Role) => void) => {
            resolutionFunc(role);
        });
    }
}
