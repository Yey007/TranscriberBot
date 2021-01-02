import { MessageEmbed } from 'discord.js';
import { channel, botClient, botMember, prefix, selfMember } from './setup';
import { container } from '../inversify.config';
import { GuildSettings } from '../services/repositories/repotypes';
import { SettingsRepository } from '../services/repositories/settingsrepository';
import { TYPES } from '../types';
import { COLORS, expectMessage, sendCommand } from './utils';

describe('Prefix', function () {
    context('without arguments', function () {
        it('should respond with the current prefix', async function () {
            const embedJson = {
                type: 'rich',
                title: 'Info',
                color: COLORS.Info,
                description: 'The prefix is currently `!`'
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('prefix');
            await promise;
        });
    });
    context('with arguments', function () {
        context('with permission', function () {
            before(async function () {
                await selfMember.roles.add(
                    selfMember.guild.roles.cache.find((x) => x.name === 'TranscriberBot Manager')
                );
            });
            it('should respond with a success message', async function () {
                const embedJson = {
                    type: 'rich',
                    title: 'Success',
                    color: COLORS.Success,
                    description: 'Prefix set to `&`'
                };
                const promise = expectMessage(new MessageEmbed(embedJson));
                await sendCommand('prefix &');
                await promise;
            });
            it('should be addressable by the new prefix', async function () {
                const promise = channel.awaitMessages((x) => x.author.id === botClient.user.id, {
                    max: 1
                });
                await channel.send('&prefix');
                await promise;
            });
            it('should respond with an error if the prefix is over 5 characters', async function () {
                const embedJson = {
                    type: 'rich',
                    title: 'Warning',
                    color: COLORS.Warning,
                    description: 'Prefix cannot be more than 5 characters.'
                };
                const promise = expectMessage(new MessageEmbed(embedJson));
                await channel.send('&prefix thisistoolong');
                await promise;
            });
            after(async function () {
                await selfMember.roles.remove(
                    selfMember.guild.roles.cache.find((x) => x.name === 'TranscriberBot Manager')
                );
            });
        });
        context('without permission', function () {
            it('should return warning', async function () {
                const embedJson = {
                    type: 'rich',
                    title: 'Permission Denied',
                    color: COLORS.Warning,
                    description:
                        'You must have the role `TranscriberBot Manager` or be an administrator in order to use this command.'
                };
                const promise = expectMessage(new MessageEmbed(embedJson));
                await channel.send('&prefix $');
                await promise;
            });
        });
    });

    after(async function () {
        //reset prefix to default
        const repo = container.get<SettingsRepository<GuildSettings>>(TYPES.GuildSettingsRepository);
        await repo.set(botMember.guild.id, { prefix: prefix });
    });
});
