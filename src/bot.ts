import { Client } from 'discord.js';
import { CommandExecutor } from './services/interface/commandexecutor';
import { TranscriptionManager } from './services/transcription/transcriptionmanager';
import { Logger } from './services/logging/logger';
import { LogOrigin } from './services/logging/logorigin';
import { Inject, Service } from 'typedi';

@Service()
export class Bot {
    public constructor(
        @Inject('discord_client') public client: Client,
        @Inject('discord_token') private token: string,
        private commandExecutor: CommandExecutor,
        private transcriptionManager: TranscriptionManager
    ) {}

    public async start(): Promise<void> {
        Logger.info('Starting bot...', LogOrigin.Self);
        await this.client.login(this.token);
        this.registerEvents();
    }

    public stop(): void {
        Logger.info('Destroying client...', LogOrigin.Self);
        this.client.destroy();
    }

    private registerEvents() {
        this.client.on('ready', async () => {
            Logger.info('Bot is ready', LogOrigin.Discord);
            await this.client.user.setStatus('online');
        });
        this.client.on('message', (message) => {
            Logger.verbose(`Recieved message from channel with id ${message.channel.id}`, LogOrigin.Discord);
            this.commandExecutor.executeCommand(message);
        });
        this.client.on('guildMemberSpeaking', (member, speaking) => {
            Logger.verbose(`Speech event fired from user with id ${member.user.id}`, LogOrigin.Discord);
            const channelMembers = member.voice.channel.members;
            const botMember = member.guild.me;
            if (!member.user.bot && speaking.bitfield === 1 && channelMembers.get(botMember.id) !== undefined) {
                const vc = botMember.voice.connection;
                this.transcriptionManager.speaking(vc, member);
            }
        });
        this.client.setInterval(async () => {
            const serversPlural = this.client.guilds.cache.size === 1 ? 'server' : 'servers';
            await this.client.user.setPresence({
                activity: {
                    name: `${this.client.guilds.cache.size} ${serversPlural}`,
                    type: 'LISTENING'
                }
            });
            Logger.verbose(`Set Discord presence`, LogOrigin.Discord);
        }, 5000);
    }
}
