import { Message } from 'discord.js';
import { BotCommand } from '../interface/botcommand';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import { checkedSend } from '../interface/misc/checkedsend';
import { RoleManager } from './rolemanager';
import Container from 'typedi';
import { StandardEmbedMaker } from '../interface/misc/standardembedmaker';

export function managerOrAdminRequired(
    target: BotCommand, // The prototype of the class
    propertyKey: string, // The name of the method
    descriptor: TypedPropertyDescriptor<(message: Message, ...args: unknown[]) => Promise<void>>
): void {
    const original = descriptor.value;
    descriptor.value = function (message: Message, ...args: unknown[]): Promise<void> {
        //Dumb but only way
        const roleManager = Container.get(RoleManager);
        const embedMaker = Container.get(StandardEmbedMaker);

        if (message) {
            if (
                message.member.roles.cache.find((role) => role.name === roleManager.roleName) ||
                message.member.hasPermission('ADMINISTRATOR')
            ) {
                Logger.verbose(
                    `Allowing execution of restricted command because user with id ${message.member.user.id} had manager role or administrator level access`,
                    LogOrigin.Discord
                );
                return original.call(this, message, ...args);
            } else {
                const embed = embedMaker.makeWarning();
                embed.title = 'Permission Denied';
                embed.description = `You must have the role \`${roleManager.roleName}\` or be an administrator in order to use this command.`;
                checkedSend(message.channel, embed);
                Logger.verbose(
                    `Did not allow execution of restricted command because user with id ${message.member.user.id} did not have manager role or administrator level access`,
                    LogOrigin.Discord
                );
            }
        }
    };
}
