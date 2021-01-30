import { Client, GuildMember, TextChannel, VoiceChannel } from 'discord.js';
import dotenv from 'dotenv';
import { bot, botInit } from '..';
import { Logger } from '../services/logging/logger';
import { clearDb } from './utils';

export let selfClient: Client;
export let botClient: Client;

export let channel: TextChannel;
export let selfVoiceChannel: VoiceChannel;
export let botVoiceChannel: VoiceChannel;

export let selfMember: GuildMember;
export let botMember: GuildMember;

export let prefix: string;

export const mochaHooks = {
    beforeAll(done: () => unknown): void {
        this.timeout(30000);
        (async () => {
            if (process.env.CONTAINER !== 'true') {
                dotenv.config({ path: 'test.env' });
            }

            await botInit();

            prefix = process.env.TESTING_PREFIX;
            Logger.debug(process.env.TESTING_PREFIX);

            selfClient = new Client();
            await selfClient.login(process.env.DISCORD_TEST_TOKEN);
            botClient = bot.client;

            channel = (await selfClient.channels.fetch(process.env.TESTING_CHANNEL_ID)) as TextChannel;
            selfVoiceChannel = (await selfClient.channels.fetch(process.env.TESTING_VOICE_CHANNEL_ID)) as VoiceChannel;
            botVoiceChannel = (await botClient.channels.fetch(process.env.TESTING_VOICE_CHANNEL_ID)) as VoiceChannel;

            selfMember = selfVoiceChannel.guild.member(selfClient.user);
            botMember = selfVoiceChannel.guild.member(bot.client.user);

            await clearDb();
        })().then(done);
    }
};
