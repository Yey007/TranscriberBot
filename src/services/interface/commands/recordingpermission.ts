import { Message } from 'discord.js';
import { Logger } from '../../logging/logger';
import { LogOrigin } from '../../logging/logorigin';
import { StandardEmbedMaker } from '../misc/standardembedmaker';
import { RecordingPermissionState } from '../misc/misctypes';
import { BotCommand } from '../botcommand';
import { CommandArgs } from '../commandargs';
import { checkedSend } from '../misc/checkedsend';
import { Service } from 'typedi';
import { UserSettingsRepository } from '../../repositories/userrepo';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserSettings } from '../../../entity/usersettings';

@Service()
export class RecordingPermissionCommand extends BotCommand {
    private _help = 'sets the recording permission for the user executing the command';
    private _args: CommandArgs[] = [
        {
            name: 'permission',
            desc: 'Whether the bot is allowed to record this user. Possible values are `accept` or `deny`',
            optional: true
        }
    ];

    public constructor(@InjectRepository() private repo: UserSettingsRepository, private maker: StandardEmbedMaker) {
        super();
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
                await this.repo.save<UserSettings>({
                    userId: message.member.user.id,
                    permission: RecordingPermissionState.Consent
                });
                success();
                return;
            } else if (args[1] === 'deny') {
                await this.repo.save<UserSettings>({
                    userId: message.member.user.id,
                    permission: RecordingPermissionState.NoConsent
                });
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
            const settings = await this.repo.findOneOrDefaults(message.member.user.id);
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
