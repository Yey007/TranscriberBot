import { GuildMember, Message, VoiceConnection } from "discord.js";
import { injectable } from "inversify";
import { BotCommand } from "./botcommand";

@injectable()
export class HelpSender extends BotCommand {

    public async execute(message: Message, args: string[]): Promise<void> {

    }
    public help(): string {
        return "Gives help about a command"
    }

}