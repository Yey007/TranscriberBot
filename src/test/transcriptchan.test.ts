import { expect } from 'chai';
import { MessageEmbed } from 'discord.js';
import { channel, selfMember, selfVoiceChannel } from './setup';
import { container } from '../inversify.config';
import { TYPES } from '../types';
import { COLORS, expectMessage, sendCommand } from './utils';
import { TranscriptChanRepository } from '../services/repositories/transcriptchanrepository';

describe('Transcription Channel', function () {
    let repo: TranscriptChanRepository;

    before(async function () {
        repo = container.get<TranscriptChanRepository>(TYPES.TranscriptionChannelRespository);
        await selfMember.roles.add(selfMember.guild.roles.cache.find((x) => x.name === 'TranscriberBot Manager'));
    });

    beforeEach(async function () {
        await repo.remove(selfVoiceChannel.id);
    });

    afterEach(async function () {
        await repo.remove(selfVoiceChannel.id);
    });

    context('when creating', function () {
        it('should return a success message and set in database when channel exists', async function () {
            const embedJson = {
                type: 'rich',
                title: 'Success',
                color: COLORS.Success,
                description: `Set the transcription channel for \`${selfVoiceChannel.name}\` to this channel`
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand(`transcript-chan create ${selfVoiceChannel.name}`);
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
            await sendCommand('transcript-chan create channel-that-doesnt-exist');
            await promise;
        });
    });

    context('when removing', function () {
        it('should return a success message and remove from database when transcription channel exists', async function () {
            await repo.set(selfVoiceChannel.id, channel.id);
            const embedJson = {
                type: 'rich',
                title: 'Success',
                color: COLORS.Success,
                description: `Removed the transcription channel for \`${selfVoiceChannel.name}\``
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand(`transcript-chan remove ${selfVoiceChannel.name}`);
            await promise;

            const results = await repo.get(selfVoiceChannel.id);
            expect(results).to.be.null;
        });
        it('should return a warning message when transcription channel does not exist', async function () {
            const embedJson = {
                type: 'rich',
                title: 'Warning',
                color: COLORS.Warning,
                description: `A transcription channel for the voice channel \`${selfVoiceChannel.name}\` does not exist`
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand(`transcript-chan remove ${selfVoiceChannel.name}`);
            await promise;
        });
    });

    context('when requesting all', function () {
        it('should return a list of all transcription channels', async function () {
            await repo.set(selfVoiceChannel.id, channel.id);
            const embedJson = {
                type: 'rich',
                title: 'All Transcription Channels',
                color: COLORS.Info,
                description: `${selfVoiceChannel.name} :arrow_right: <#${channel.id}>`
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('transcript-chan all');
            await promise;
        });
    });

    after(async function () {
        await selfMember.roles.remove(selfMember.guild.roles.cache.find((x) => x.name === 'TranscriberBot Manager'));
    });
});
