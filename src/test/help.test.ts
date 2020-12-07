import { MessageEmbed } from 'discord.js';
import { COLORS, expectMessage, sendCommand } from './utils';

describe('Help', () => {
    context('without arguments', () => {
        it('should return command list', async () => {
            const embedJson = {
                type: 'rich',
                title: 'Help',
                color: COLORS.Info,
                fields: [
                    {
                        value:
                            "`help` - returns a list of commands\n`join` - joins a voice channel\n`leave` - returns a list of commands\n`prefix` - sets this bot's prefix for this server\n`rec-perm` - sets the recording permission for the user executing the command\n`set-transcript-chan` - sets the transcription channel for a discord server as the current channel",
                        name: 'Commands',
                    },
                    {
                        value:
                            'You can address the bot in two ways\n\n1. Mention the bot at the start of your message, like this: **<@774096457053634560> command**\n2. Use the prefix (! by default), like this: **!command**',
                        name: 'Addressing',
                    },
                ],
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('help');
            await promise;
        });
    });

    context('with arguments', () => {
        it('should respond correctly when the given command has no arguments', async () => {
            //join
            const embedJson = {
                type: 'rich',
                title: 'Help',
                color: COLORS.Info,
                description: '`join` joins a voice channel\nBrackets [] denote optional arguments.',
                fields: [
                    {
                        value: '`join`',
                        name: 'Usage',
                    },
                ],
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('help join');
            await promise;
        });
        it('should respond correctly when the given command has required arguments', async () => {
            //set-transcript-chan
            const embedJson = {
                type: 'rich',
                title: 'Help',
                color: COLORS.Info,
                description:
                    '`set-transcript-chan` sets the transcription channel for a discord server as the current channel\nBrackets [] denote optional arguments.',
                fields: [
                    {
                        value: '`set-transcript-chan voiceChannel`',
                        name: 'Usage',
                    },
                    {
                        value:
                            '`voiceChannel` - the name of the voice channel that should be transcribed into this channel.',
                        name: 'Arguments',
                    },
                ],
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('help set-transcript-chan');
            await promise;
        });
        it('should respond correctly when the given command has optional arguments', async () => {
            //prefix
            const embedJson = {
                type: 'rich',
                title: 'Help',
                color: COLORS.Info,
                description:
                    '`set-transcript-chan` sets the transcription channel for a discord server as the current channel\nBrackets [] denote optional arguments.',
                fields: [
                    {
                        value: '`set-transcript-chan voiceChannel`',
                        name: 'Usage',
                    },
                    {
                        value:
                            '`voiceChannel` - the name of the voice channel that should be transcribed into this channel.',
                        name: 'Arguments',
                    },
                ],
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('help set-transcript-chan');
            await promise;
        });
    });
});
