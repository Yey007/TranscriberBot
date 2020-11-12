import migrate from "db-migrate"
import { container } from "./inversify.config"
import { Bot } from "./bot"
import { TYPES } from "./types"

const bot: Bot = container.get<Bot>(TYPES.Bot)
const dbm = migrate.getInstance(true)

dbm.up().then(() => {
    bot.start().then(() => {
        console.log('Logged in!')
    }).catch((error) => {
        console.log('Oh no!!! ', error)
    });
}).catch((err) => {
    console.log("Issue running migrations: " + err)
})