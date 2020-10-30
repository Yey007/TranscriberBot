import { Message } from "discord.js";
import { injectable } from "inversify";

//TODO: Add args function
//Also performance testing to see what we can optimize (besides api calls obv)
@injectable()
export abstract class BotCommand {
    public async abstract execute(message: Message, args: string[]): Promise<void>
    public abstract get help(): string
    public abstract get args(): [string, string][]
}