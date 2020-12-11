import { botMember, selfMember, selfVoiceChannel } from './setup';
import { awaitChannelJoin, sendCommand } from './utils';

describe('Join', function () {
    it('should join voice channel of bot', async function () {
        await selfVoiceChannel.join();

        const promise = awaitChannelJoin();
        await sendCommand('join');
        await promise;

        //Kick bot
        await botMember.voice.setChannel(null);
        //Kick self
        await selfMember.voice.setChannel(null);
    });
});
