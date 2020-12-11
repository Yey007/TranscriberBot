import { botMember, selfMember, selfVoiceChannel } from './setup';
import { awaitChannelJoin, sendCommand } from './utils';

describe('Join', function () {
    before(async function () {
        await selfVoiceChannel.join();
    });

    it('should join voice channel of bot', async function () {
        const promise = awaitChannelJoin();
        await sendCommand('join');
        await promise;
    });

    after(async function () {
        //Kick bot
        await botMember.voice.setChannel(null);

        //Kick self
        await selfMember.voice.setChannel(null);
    });
});
