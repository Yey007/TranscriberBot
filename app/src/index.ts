import migrate from "db-migrate"
import { container } from "./inversify.config"
import { Bot } from "./bot"
import { TYPES } from "./types"
import { cleanUpInit } from "./cleanup"

const bot: Bot = container.get<Bot>(TYPES.Bot)
const dbm = migrate.getInstance(true)

cleanUpInit()

dbm.up().then(() => {
    bot.start().then(() => {
        console.log('Logged in!')
    }).catch((error) => {
        console.log('Oh no!!! ', error)
    });
}).catch((err) => {
    console.log("Issue running migrations: " + err)
})