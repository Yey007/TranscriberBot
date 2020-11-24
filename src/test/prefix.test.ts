import { MessageEmbed } from "discord.js"
import { channel, botClient, botMember, prefix } from "."
import { container } from "../inversify.config"
import { GuildSettings } from "../services/repositories/guildsettings/guildsettings"
import { SettingsRepository } from "../services/repositories/settingsrepository"
import { TYPES } from "../types"
import { COLORS, expectMessage, sendCommand } from "./utils"

describe("Prefix", () => {
    context("without arguments", async () => {
        it("should respond with the current prefix", async () => {
            await sendCommand("prefix")
            const embedJson = {
                type: "rich",
                title: "Info",
                color: COLORS.Info,
                description: "The prefix is currently `!`",
            };
            await expectMessage(new MessageEmbed(embedJson))
        })
    })
    context("with arguments", () => {
        it("should respond with a success message", async () => {
            await sendCommand("prefix &")
            const embedJson = {
                type: "rich",
                title: "Success",
                color: COLORS.Success,
                description: "Prefix set to `&`",
            };
            await expectMessage(new MessageEmbed(embedJson))
        })
        it("should be addressable by the new prefix", async () => {
            await channel.send("&prefix")
            await channel.awaitMessages(x => x.author.id === botClient.user.id, {
                max: 1
            })
        })
        it("should respond with an error if the prefix is over 5 characters", async () => {
            await channel.send("&prefix thisistoolong")
            const embedJson = {
                type: "rich",
                title: "Error",
                color: COLORS.Error,
                description: "Prefix is too long",
            };
            await expectMessage(new MessageEmbed(embedJson))
        })
        //TODO: Permission tests (probably requires the bot to not have admin)
    })

    after(async () => {
        //reset prefix
        let repo = container.get<SettingsRepository<GuildSettings>>(TYPES.GuildSettingsRepository)
        await repo.set(botMember.guild.id, {prefix: prefix})
        console.log(await repo.get(botMember.guild.id))
    })
})