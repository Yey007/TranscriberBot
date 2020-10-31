import { Message } from "discord.js";
import { injectable } from "inversify";

@injectable()
export abstract class BotCommand {
    public async abstract execute(message: Message, args: string[]): Promise<void>
    public abstract get help(): string
    public abstract get args(): [string, string][]
}