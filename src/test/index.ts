import { Client, GuildMember, TextChannel, User, VoiceChannel } from "discord.js"
import dotenv from "dotenv"
import { bot, botInit } from "../index"

export var selfClient: Client
export var botClient: Client

export var channel: TextChannel
export var selfVoiceChannel: VoiceChannel
export var botVoiceChannel: VoiceChannel

export var selfMember: GuildMember
export var botMember: GuildMember

export var prefix: string

before(function (done) {
    this.timeout(30000);
    (async () => {
        if(process.env.CONTAINER !== "true") {
            dotenv.config({path: "../test.env"})
        }

        await botInit()

        prefix = process.env.PREFIX

        selfClient = new Client()
        await selfClient.login(process.env.DISCORD_TEST_TOKEN)
        botClient = bot.client

        channel = await selfClient.channels.fetch(process.env.TESTING_CHANNEL_ID) as TextChannel
        selfVoiceChannel = await selfClient.channels.fetch(process.env.TESTING_VOICE_CHANNEL_ID) as VoiceChannel
        botVoiceChannel = await botClient.channels.fetch(process.env.TESTING_VOICE_CHANNEL_ID) as VoiceChannel

        selfMember = selfVoiceChannel.guild.member(selfClient.user)
        botMember = selfVoiceChannel.guild.member(bot.client.user)

    })().then(done);
})

after(() => {
    selfClient.destroy()
    bot.stop()
})

