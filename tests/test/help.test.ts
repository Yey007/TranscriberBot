import assert from "assert"
import { MessageEmbed } from "discord.js";
import { channel, otherBotId } from "./index"
import { expectMessage } from "./utils";

describe('Help', function () {
    it('should return command list without arguments', function () {
        channel.send("!help")
        const embedJson = {
            "title": "Help",
            "color": 4628448,
            "fields": [
                {
                    "value": "`help` - returns a list of commands\n`join` - joins a voice channel\n`leave` - returns a list of commands\n`prefix` - sets this bot's prefix for this server\n`rec-perm` - sets the recording permission for the user executing the command\n`set-transcript-chan` - sets the transcription channel for a discord server as the current channel",
                    "name": "Commands"
                },
                {
                    "value": "You can address the bot in two ways\n\n1. Mention the bot at the start of your message, like this: **<@774096457053634560> command**\n2. Use the prefix (! by default), like this: **!command**",
                    "name": "Addressing"
                }
            ]
        };
        return expectMessage(new MessageEmbed(embedJson))
    });
});