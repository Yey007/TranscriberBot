import { expect } from 'chai';
import { MessageEmbed } from 'discord.js';
import { selfClient } from './setup';
import { RecordingPermissionState } from '../services/interface/misc/misctypes';
import { COLORS, expectMessage, sendCommand } from './utils';
import { UserSettingsRepository } from '../services/repositories/userrepo';
import { getCustomRepository } from 'typeorm';
import { UserSettings } from '../entity/usersettings';

describe('Recording Permission', function () {
    let userRepo: UserSettingsRepository;
    before(function () {
        userRepo = getCustomRepository(UserSettingsRepository);
    });
    context('without arguments', function () {
        let denyJson: Record<string, unknown>;
        before(function () {
            denyJson = {
                type: 'rich',
                title: 'Info',
                color: COLORS.Info,
                description: 'Your recording preference is currently set to `deny`'
            };
        });
        it('should return deny if not set', async function () {
            const promise = expectMessage(new MessageEmbed(denyJson));
            await sendCommand('rec-perm');
            await promise;
        });
        it('should return deny if set to unknown', async function () {
            await userRepo.save<UserSettings>({
                userId: selfClient.user.id,
                permission: RecordingPermissionState.Unknown
            });
            const promise = expectMessage(new MessageEmbed(denyJson));
            await sendCommand('rec-perm');
            await promise;
        });
        it('should return deny if set to deny', async function () {
            await userRepo.save<UserSettings>({
                userId: selfClient.user.id,
                permission: RecordingPermissionState.NoConsent
            });
            const promise = expectMessage(new MessageEmbed(denyJson));
            await sendCommand('rec-perm');
            await promise;
        });
        it('should return accept when set to accept', async function () {
            await userRepo.save<UserSettings>({
                userId: selfClient.user.id,
                permission: RecordingPermissionState.Consent
            });

            const acceptJson = {
                type: 'rich',
                title: 'Info',
                color: COLORS.Info,
                description: 'Your recording preference is currently set to `accept`'
            };

            const promise = expectMessage(new MessageEmbed(acceptJson));
            await sendCommand('rec-perm');
            await promise;
        });

        after(async function () {
            await userRepo.save<UserSettings>({
                userId: selfClient.user.id,
                permission: RecordingPermissionState.Unknown
            });
        });
    });
    context('with arguments', function () {
        it('should respond with a success message and set to deny when provided deny', async function () {
            const embedJson = {
                type: 'rich',
                title: 'Success',
                color: COLORS.Success,
                description: 'Recording permission set to `deny`'
            };

            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('rec-perm deny');
            await promise;

            const settings = await userRepo.findOneOrDefaults(selfClient.user.id);
            expect(RecordingPermissionState.NoConsent).to.equal(settings.permission);
        });
        it('should respond with a success message and set to accept when provided accept', async function () {
            const embedJson = {
                type: 'rich',
                title: 'Success',
                color: COLORS.Success,
                description: 'Recording permission set to `accept`'
            };

            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('rec-perm accept');
            await promise;

            const settings = await userRepo.findOneOrDefaults(selfClient.user.id);
            expect(RecordingPermissionState.Consent).to.equal(settings.permission);
        });

        after(async function () {
            await userRepo.save<UserSettings>({
                userId: selfClient.user.id,
                permission: RecordingPermissionState.Unknown
            });
        });
    });
});
