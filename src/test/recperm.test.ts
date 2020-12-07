import { expect } from 'chai';
import { MessageEmbed } from 'discord.js';
import { selfClient } from '.';
import { container } from '../inversify.config';
import { SettingsRepository } from '../services/repositories/settingsrepository';
import { RecordingPermissionState, UserSettings } from '../services/repositories/usersettings/usersettings';
import { TYPES } from '../types';
import { COLORS, expectMessage, sendCommand } from './utils';

describe('Recording Permission', () => {
    const userRepo = container.get<SettingsRepository<UserSettings>>(TYPES.UserSettingsRepository);
    context('without arguments', () => {
        const denyJson = {
            type: 'rich',
            title: 'Info',
            color: COLORS.Info,
            description: 'Your recording preference is currently set to `deny`',
        };
        it('should return deny if not set', async () => {
            const promise = expectMessage(new MessageEmbed(denyJson));
            await sendCommand('rec-perm');
            await promise;
        });
        it('should return deny if set to unknown', async () => {
            await userRepo.set(selfClient.user.id, { permission: RecordingPermissionState.Unknown });
            const promise = expectMessage(new MessageEmbed(denyJson));
            await sendCommand('rec-perm');
            await promise;
        });
        it('should return deny if set to deny', async () => {
            await userRepo.set(selfClient.user.id, { permission: RecordingPermissionState.NoConsent });
            const promise = expectMessage(new MessageEmbed(denyJson));
            await sendCommand('rec-perm');
            await promise;
        });
        it('should return accept when set to accept', async () => {
            await userRepo.set(selfClient.user.id, { permission: RecordingPermissionState.Consent });

            const acceptJson = {
                type: 'rich',
                title: 'Info',
                color: COLORS.Info,
                description: 'Your recording preference is currently set to `accept`',
            };

            const promise = expectMessage(new MessageEmbed(acceptJson));
            await sendCommand('rec-perm');
            await promise;
        });

        after(async () => {
            //TODO: Delete function?
            await userRepo.set(selfClient.user.id, { permission: RecordingPermissionState.Unknown });
        });
    });
    context('with arguments', () => {
        it('should respond with a success message and set to deny when provided deny', async () => {
            const embedJson = {
                type: 'rich',
                title: 'Success',
                color: COLORS.Success,
                description: 'Recording permission set to `deny`',
            };

            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('rec-perm deny');
            await promise;

            const settings = await userRepo.get(selfClient.user.id);
            expect(RecordingPermissionState.NoConsent).to.equal(settings.permission);
        });
        it('should respond with a success message and set to accept when provided accept', async () => {
            const embedJson = {
                type: 'rich',
                title: 'Success',
                color: COLORS.Success,
                description: 'Recording permission set to `accept`',
            };

            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('rec-perm accept');
            await promise;

            const settings = await userRepo.get(selfClient.user.id);
            expect(RecordingPermissionState.Consent).to.equal(settings.permission);
        });

        after(async () => {
            //TODO: Delete function?
            await userRepo.set(selfClient.user.id, { permission: RecordingPermissionState.Unknown });
        });
    });
});
