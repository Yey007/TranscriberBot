import { Client } from "discord.js";
import { CommandExecutor } from "./services/commands/commandexecutor";
import { inject, injectable } from "inversify";
import { TYPES } from "./types";
import { TranscriptionManager } from "./services/transcription/transcriptionmanager";

@injectable()
export class Bot {
    
    private client: Client
    private readonly token: string
    private executor: CommandExecutor
    private transcriptionManager: TranscriptionManager

    public constructor(    
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.CommandExecutor) commandExecutor: CommandExecutor,
        @inject(TYPES.TranscriptionManager) transcriptionManager: TranscriptionManager) 
    {
        this.client = client
        this.token = token
        this.executor = commandExecutor
        this.transcriptionManager = transcriptionManager
    }

	public start(): Promise<string> {
		console.log("Starting...")

        this.registerEvents()
        
        return this.client.login(this.token)
    }

    private registerEvents() {
        this.client.on("ready", () => {
            let guilds = this.client.guilds.cache.array()
            for(let guild of guilds) {
                
            }
        })
        this.client.on("message", (message) => {
            this.executor.executeCommand(message)
        })
        this.client.on("guildMemberSpeaking", (member, speaking) => {
            let channelMembers = member.voice.channel.members
            let botMember = member.guild.member(this.client.user)
            if(speaking.bitfield === 1 && channelMembers.get(botMember.id) !== undefined) {
                let vc = botMember.voice.connection
                this.transcriptionManager.speaking(vc, member)
            }
        })
        this.client.on("guildCreate", (guild) => {
            
        })
        this.client.on("error", (err) => {
            console.log("Discord error: " + err)
        })
    }
}