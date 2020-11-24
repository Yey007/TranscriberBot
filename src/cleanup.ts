import { Bot } from "./bot";
import { container } from "./inversify.config";
import { TYPES } from "./types";

export function cleanUpInit() {
    let killSignals = [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`]
    killSignals.forEach((eventType) => {
        process.on(eventType, cleanUp.bind(null, eventType));
    })
}

function cleanUp(eventType) {
    console.log("Recieved " + eventType)
    console.log("Stopping bot...")
    let bot = container.get<Bot>(TYPES.Bot)
    bot.stop()
}