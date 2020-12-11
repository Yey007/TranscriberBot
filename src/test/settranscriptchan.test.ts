import { expect } from 'chai';
import { MessageEmbed } from 'discord.js';
import { channel, selfMember, selfVoiceChannel } from './setup';
import { container } from '../inversify.config';
import { SettingsRepository } from '../services/repositories/settingsrepository';
import { TYPES } from '../types';
import { COLORS, expectMessage, sendCommand } from './utils';

describe('Set Transcript Channel', function () {
    let repo: SettingsRepository<string>;

    before(async function () {
        repo = container.get<SettingsRepository<string>>(TYPES.TranscriptionChannelRespository);
        await repo.set(selfVoiceChannel.id, '');
        await selfMember.roles.add(selfMember.guild.roles.cache.find((x) => x.name === 'TranscriberBot Manager'));
    });

    it('should return a success message and set in database when channel exists', async function () {
        const embedJson = {
            type: 'rich',
            title: 'Success',
            color: COLORS.Success,
            description: `Set the transcription channel for \`${selfVoiceChannel.name}\` to this channel`
        };
        const promise = expectMessage(new MessageEmbed(embedJson));
        await sendCommand(`set-transcript-chan ${selfVoiceChannel.name}`);
        await promise;

        const results = await repo.get(selfVoiceChannel.id);
        expect(results).to.equal(channel.id);
    });
    it('should return a warning message when channel does not exist', async function () {
        const embedJson = {
            type: 'rich',
            title: 'Warning',
            color: COLORS.Warning,
            description: 'Voice channel `channel-that-doesnt-exist` not found'
        };
        const promise = expectMessage(new MessageEmbed(embedJson));
        await sendCommand('set-transcript-chan channel-that-doesnt-exist');
        await promise;
    });

    after(async function () {
        await repo.set(selfVoiceChannel.id, '');
        await selfMember.roles.remove(selfMember.guild.roles.cache.find((x) => x.name === 'TranscriberBot Manager'));
    });
});
