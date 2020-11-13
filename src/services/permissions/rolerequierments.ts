import { Message } from "discord.js";
import { container } from "../../inversify.config";
import { TYPES } from "../../types";
import { BotCommand } from "../commands/botcommand";
import { StandardEmbedMaker } from "../misc/standardembedmaker";
import { RoleManager } from "./rolemanager";

export function managerRequired(
    target: BotCommand, // The prototype of the class
    propertyKey: "execute", // The name of the method
    descriptor: TypedPropertyDescriptor<(message: Message, args: string[]) => Promise<void>>
    ) {
    const original = descriptor.value
    descriptor.value = function(message: Message, args: string[]): Promise<void> {
        //Dumb but only way
        const roleManager = container.get<RoleManager>(TYPES.RoleManager)
        const embedMaker = container.get<StandardEmbedMaker>(TYPES.StandardEmbedMaker)

        if (message) {
            if (message.member.roles.cache.find(role => role.name === roleManager.roleName)) {
                return original.call(this, message, args)
            } else {
                let embed = embedMaker.makeWarning()
                embed.title = "Permission Denied"
                embed.description = `You must have the role \`${roleManager.roleName}\` in order to use this command.`
                message.channel.send(embed)
            }
        }
    }
}
