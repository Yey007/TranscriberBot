import migrate from "db-migrate"
import { container } from "./inversify.config"
import { Bot } from "./bot"
import { TYPES } from "./types"
import { cleanUpInit } from "./cleanup"

export const bot: Bot = container.get<Bot>(TYPES.Bot)

export async function botInit() {
    cleanUpInit()
    const dbm = migrate.getInstance(true)
    await dbm.up()
    await bot.start()
}

if (require.main === module) {
    botInit().then(() => {
        console.log("Logged in!")
    }).catch((err) => {
        console.log("Oh no!", err)
    })
}