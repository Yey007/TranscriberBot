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
            const success = async function () {
                const embed = maker.makeSuccess();
                embed.description = `Recording permission set to \`${args[1]}\``;
                await checkedSend(message.channel, embed);
                Logger.verbose(
                    `Sent recording permission set success message in channel with id ${message.channel.id}`,
                    LogOrigin.Discord
                );
            };

            if (args[1] === 'accept') {
                const repoSave = this.repo.save<UserSettings>({
                    userId: message.member.user.id,
                    permission: RecordingPermissionState.Consent
                });
                const successSend = success();
                await Promise.all([repoSave, successSend]);
                return;
            } else if (args[1] === 'deny') {
                const repoSave = this.repo.save<UserSettings>({
                    userId: message.member.user.id,
                    permission: RecordingPermissionState.NoConsent
                });
                const successSend = success();
                await Promise.all([repoSave, successSend]);
                return;
            }
            await checkedSend(message.channel, 'Invalid setting. Acceptable arguments are `accept` and `deny`.');
            Logger.verbose(
                `Sent recording permission set failure message in channel with id ${message.channel.id}`,
                LogOrigin.Discord
            );
        } else {
            const embed = this.maker.makeInfo();
            const settings = await this.repo.findOneOrDefaults(message.member.user.id);
            const perm = settings.permission === RecordingPermissionState.Consent ? 'accept' : 'deny';
            embed.description = `Your recording preference is currently set to \`${perm}\``;
            await checkedSend(message.channel, embed);
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
