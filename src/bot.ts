import { Client, VoiceConnection } from "discord.js";
import { CommandExecutor } from "./services/commandexecutor";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import { TranscriptionManager } from "./services/transcriptionmanager";

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

        this.registerevents()

        return this.client.login(this.token);
    }

    private registerevents() {
        this.client.on("message", (message) => this.executor.executecommand(message))
        this.client.on("guildMemberSpeaking", async (member, speaking) => {
            /*
            let inchannel = false
            let connection: VoiceConnection = undefined
            this.client.voice.connections.array().forEach((vc) => {
                if(vc.channel.id === member.voice.channelID) {
                    inchannel = true
                    connection = vc
                    return
                }
            })
                        if (inchannel && speaking.bitfield === 1) {

            }
            */
            let channelMembers = member.voice.channel.members
            if(channelMembers.get(member.guild.member(this.client.user).id) !== undefined && speaking.bitfield === 1) {
                let vc = await member.voice.channel.join()
                this.transcriptionManager.speaking(vc, member)
            }
        })
    }
}