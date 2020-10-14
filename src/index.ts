import {Bot} from "./bot"
import container from "./inversify.config"
import { TYPES } from "./types"

const bot: Bot = container.get<Bot>(TYPES.Bot)
bot.start().then(() => {
    console.log('Logged in!')
}).catch((error) => {
    console.log('Oh no! ', error)
});