import { Client, TextChannel } from "discord.js"
import dotenv from "dotenv"

export var client: Client
export var channel: TextChannel
export var otherBotId: string

before(function (done) {
    this.timeout(30000);
    (async () => {
        if(process.env.CONTAINER !== "true") {
            dotenv.config({path: "./test.env"})
        }

        otherBotId = process.env.OTHER_BOT_ID

        client = new Client()
        await client.login(process.env.DISCORD_TOKEN)
        channel = await client.channels.fetch(process.env.TESTING_CHANNEL_ID) as TextChannel

        cleanUpInit();

        let otherBot = await client.users.fetch(otherBotId, false, true)
        while(otherBot.presence.status !== "online") {
            await sleep(5000)
            otherBot = await client.users.fetch(otherBotId, false, true)
        }
    })().then(done);
})

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanUpInit() {
    let killSignals = [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`]
    killSignals.forEach((eventType) => {
        process.on(eventType, cleanUp.bind(null, eventType));
    })
}

function cleanUp(eventType) {
    console.log("Recieved " + eventType)
    console.log("Stopping bot...")
    client.destroy()
    console.log("Client destroyed!")
}

