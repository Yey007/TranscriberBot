import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { StandardEmbedMaker } from '../../misc/standardembedmaker';
import { SettingsRepository } from '../../repositories/settingsrepository';
import { RecordingPermissionState, UserSettings } from '../../repositories/repotypes';
import { BotCommand } from '../botcommand';
import { CommandArgs } from '../commandargs';
import { checkedSend } from '../../misc/checkedsend';

@injectable()
export class SetRecordingPermission extends BotCommand {
    private repo: SettingsRepository<UserSettings>;
    private maker: StandardEmbedMaker;
    private _help = 'sets the recording permission for the user executing the command';
    private _args: CommandArgs[] = [
        {
            name: 'permission',
            desc: 'Whether the bot is allowed to record this user. Possible values are `accept` or `deny`',
            optional: true
        }
    ];

    public constructor(
        @inject(TYPES.UserSettingsRepository) repo: SettingsRepository<UserSettings>,
        @inject(TYPES.StandardEmbedMaker) maker: StandardEmbedMaker
    ) {
        super();
        this.repo = repo;
        this.maker = maker;
    }

    public async execute(message: Message, args: string[]): Promise<void> {
        if (args[1]) {
            const maker = this.maker;
            const success = function () {
                const embed = maker.makeSuccess();
                embed.description = `Recording permission set to \`${args[1]}\``;
                checkedSend(message.channel, embed);
                Logger.verbose(
                    `Sent recording permission set success message in channel with id ${message.channel.id}`,
                    LogOrigin.Discord
                );
            };

            if (args[1] === 'accept') {
                this.repo.set(message.member.user.id, { permission: RecordingPermissionState.Consent });
                success();
                return;
            } else if (args[1] === 'deny') {
                this.repo.set(message.member.user.id, { permission: RecordingPermissionState.NoConsent });
                success();
                return;
            }
            message.channel.send('Invalid setting. Acceptable arguments are `accept` and `deny`.');
            Logger.verbose(
                `Sent recording permission set failure message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        } else {
            const embed = this.maker.makeInfo();
            const settings = await this.repo.get(message.member.user.id);
            const perm = settings.permission === RecordingPermissionState.Consent ? 'accept' : 'deny';
            embed.description = `Your recording preference is currently set to \`${perm}\``;
            checkedSend(message.channel, embed);
            Logger.verbose(
                `Sent recording permission get message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        }
    }

    public get help(): string {
        return this._help;
    }

    public get args(): CommandArgs[] {
        return this._args;
    }
}
