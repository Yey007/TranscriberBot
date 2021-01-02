import { MessageEmbed } from 'discord.js';
import { COLORS, expectMessage, sendCommand } from './utils';

describe('Help', function () {
    context('without arguments', function () {
        it('should return command list', async function () {
            const embedJson = {
                type: 'rich',
                title: 'Help',
                color: COLORS.Info,
                fields: [
                    {
                        value:
                            "`help` - returns a list of commands\n`join` - joins a voice channel\n`leave` - returns a list of commands\n`prefix` - sets this bot's prefix for this server\n`rec-perm` - sets the recording permission for the user executing the command\n`transcript-chan` - allows for various operations involving transcription channels",
                        name: 'Commands'
                    },
                    {
                        value:
                            'You can address the bot in two ways\n\n1. Mention the bot at the start of your message, like this: **<@774096457053634560> command**\n2. Use the prefix (! by default), like this: **!command**',
                        name: 'Addressing'
                    }
                ]
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('help');
            await promise;
        });
    });

    context('with arguments', function () {
        it('should respond correctly when the given command has no arguments', async function () {
            //join
            const embedJson = {
                type: 'rich',
                title: 'Help',
                color: COLORS.Info,
                description: '`join` joins a voice channel\nBrackets [] denote optional arguments.',
                fields: [
                    {
                        value: '`join`',
                        name: 'Usage'
                    }
                ]
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('help join');
            await promise;
        });
        it('should respond correctly when the given command has arguments', async function () {
            //set-transcript-chan
            const embedJson = {
                type: 'rich',
                title: 'Help',
                color: COLORS.Info,
                description:
                    '`transcript-chan` allows for various operations involving transcription channels\nBrackets [] denote optional arguments.',
                fields: [
                    {
                        value: '`transcript-chan operation [voiceChannel]`',
                        name: 'Usage'
                    },
                    {
                        value:
                            '`operation` - can be `create`, `remove` or `all`. `create` will create a new transcription channel, `remove` will remove one, and `all` will return a list of all transcription channels.\n`voiceChannel` - the name of the voice channel that should be used for the specified operation. Not required if the operation is `all`',
                        name: 'Arguments'
                    }
                ]
            };
            const promise = expectMessage(new MessageEmbed(embedJson));
            await sendCommand('help transcript-chan');
            await promise;
        });
    });
});
