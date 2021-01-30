import { Message } from 'discord.js';
import { CommandArgs } from './commandargs';

export abstract class BotCommand {
    public abstract execute(message: Message, args: string[]): Promise<void>;
    public abstract get help(): string;
    public abstract get args(): CommandArgs[];
}
