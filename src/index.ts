import migrate from "db-migrate"
import { container } from "./inversify.config"
import { Bot } from "./bot"
import { TYPES } from "./types"

const bot: Bot = container.get<Bot>(TYPES.Bot)
const dbm = migrate.getInstance(true)

// If we're in docker, this will likely crash the process multiple times because it can't connect. That's intended.
dbm.up().then(() => {
    bot.start().then(() => {
        console.log('Logged in!')
    }).catch((error) => {
        console.log('Oh no!!! ', error)
    });
})