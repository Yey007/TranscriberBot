import { Client } from "discord.js";
import { CommandExecutor } from "./services/commandexecutor";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";

@injectable()
export class Bot {
    
    private client: Client
    private readonly token: string
    private executor: CommandExecutor

    public constructor(    
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.CommandExecutor) commandExecutor: CommandExecutor) 
    {

        this.client = client
        this.token = token
        this.executor = commandExecutor
    }

	public start(): Promise<string> {
		console.log("Starting...")
        
        this.registerevents()

		return this.client.login(this.token);
    }

    private registerevents() {
        this.client.on("message", (message) => this.executor.executecommand(message))
    }
}