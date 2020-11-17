import { Message } from "discord.js"
import { inject, injectable } from "inversify"
import { TYPES } from "../../../types"
import { StandardEmbedMaker } from "../../misc/standardembedmaker"
import { SettingsRepository } from "../../repositories/settingsrepository"
import { RecordingPermissionState, UserSettings } from "../../repositories/usersettings/usersettings"
import { BotCommand } from "../botcommand"
import { CommandArgs } from "../commandargs"

@injectable()
export class SetRecordingPermission extends BotCommand {

    private repo: SettingsRepository<UserSettings>
    private maker: StandardEmbedMaker
    private _help = "sets the recording permission for the user executing the command"
    private _args: CommandArgs[] = [
        {name: "permission", desc: "Whether the bot is allowed to record this user. Possible values are `accept` or `deny`", 
        optional: false}
    ]

    public constructor(
        @inject(TYPES.UserSettingsRepository) repo: SettingsRepository<UserSettings>,
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker) 
    {
        super()
        this.repo = repo
        this.maker = maker
    }

    public async execute(message: Message, args: string[]): Promise<void> {

        let maker = this.maker
        const success = function() {
            let embed = maker.makeSuccess()
            embed.description = `Recording permission set to \`${args[1]}\``
            message.channel.send(embed)
        }

        if(args[1] === "accept") {
            this.repo.set(message.member.user.id, {permission: RecordingPermissionState.Consent})
            success()
            return
        } else if(args[1] === "deny") {
            this.repo.set(message.member.user.id, {permission: RecordingPermissionState.NoConsent})
            success()
            return
        }
        message.channel.send("Invalid setting. Acceptable arguments are `accept` and `deny`.")
    }
    
    public get help(): string {
        return this._help
    }

    public get args(): CommandArgs[] {
        return this._args
    }

}