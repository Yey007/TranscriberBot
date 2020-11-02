import { Message } from "discord.js"
import { inject, injectable } from "inversify"
import { TYPES } from "../../types"
import { AbstractPermissionRepository } from "../repositories/permission/abstractpermissionrepository"
import { RecordingPermissionState } from "../repositories/permission/usersettings"
import { BotCommand } from "./botcommand"

@injectable()
export class SetRecordingPermission extends BotCommand {

    private repo: AbstractPermissionRepository
    private _help = "sets the recording permission for the user executing the command"
    private _args: [string, string][] = [
        ["permission", "Whether the bot is allowed to record this user. Possible values are `accept` or `deny`"]
    ]

    public constructor(
        @inject(TYPES.PermissionRepository) repo: AbstractPermissionRepository) 
    {
        super()
        this.repo = repo
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if(args[1] === "accept") {
            this.repo.set(message.member.user.id, {permission: RecordingPermissionState.Consent})
            return
        } else if(args[1] === "deny") {
            this.repo.set(message.member.user.id, {permission: RecordingPermissionState.NoConsent})
            return
        }
        message.channel.send("Invalid setting. Acceptable arguments are `accept` and `deny`.")
    }
    
    public get help(): string {
        return this._help
    }

    public get args(): [string, string][] {
        return this._args
    }

}