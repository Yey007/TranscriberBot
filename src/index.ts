import migrate from "migrate"
import { container } from "./inversify.config"
import { Bot } from "./bot"
import { TYPES } from "./types"

const bot: Bot = container.get<Bot>(TYPES.Bot)

migrate.load({stateStore: '.migrate'}, function (err, set) {
    if (err) {
        throw err
    }
    set.up(function (err) {
        if (err) {
            throw err
        }
        console.log('Ran migrations successfully.')
        bot.start().then(() => {
            console.log('Logged in!')
        }).catch((error) => {
            console.log('Oh no!!! ', error)
        });
    })
})