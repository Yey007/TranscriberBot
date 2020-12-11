import { Client } from 'discord.js';
import { CommandExecutor } from './services/interface/commandexecutor';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { TranscriptionManager } from './services/transcription/transcriptionmanager';

@injectable()
export class Bot {
    public client: Client;
    private readonly token: string;
    private executor: CommandExecutor;
    private transcriptionManager: TranscriptionManager;

    public constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.CommandExecutor) commandExecutor: CommandExecutor,
        @inject(TYPES.TranscriptionManager) transcriptionManager: TranscriptionManager
    ) {
        this.client = client;
        this.token = token;
        this.executor = commandExecutor;
        this.transcriptionManager = transcriptionManager;
    }

    public async start(): Promise<void> {
        console.log('Starting bot...');
        await this.client.login(this.token);
        this.registerEvents();
    }

    public stop(): void {
        console.log('Destroying client...');
        this.client.destroy();
    }

    private registerEvents() {
        this.client.on('ready', async () => {
            await this.client.user.setStatus('online');
        });
        this.client.on('message', (message) => {
            this.executor.executeCommand(message);
        });
        this.client.on('guildMemberSpeaking', (member, speaking) => {
            const channelMembers = member.voice.channel.members;
            const botMember = member.guild.me;
            if (!member.user.bot && speaking.bitfield === 1 && channelMembers.get(botMember.id) !== undefined) {
                const vc = botMember.voice.connection;
                this.transcriptionManager.speaking(vc, member);
            }
        });
        this.client.on('error', (err) => {
            console.log('Discord error: ' + err);
        });
        this.client.setInterval(async () => {
            const serversPlural = this.client.guilds.cache.size === 1 ? 'server' : 'servers';
            await this.client.user.setPresence({
                activity: {
                    name: `${this.client.guilds.cache.size} ${serversPlural}`,
                    type: 'LISTENING'
                }
            });
        }, 5000);
    }
}
