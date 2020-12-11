import { botMember, botVoiceChannel, selfMember, selfVoiceChannel } from './setup';
import { awaitChannelLeave, sendCommand } from './utils';

describe('Leave', function () {
    before(async function () {
        await selfVoiceChannel.join();
    });

    beforeEach(async function () {
        await botVoiceChannel.join();
    });

    context('when self in channel', function () {
        it('should leave voice channel', async function () {
            const promise = awaitChannelLeave();
            await sendCommand('leave');
            await promise;
        });
    });

    context('when self not in channel', function () {
        it('should leave voice channel', async function () {
            selfVoiceChannel.leave();
            const promise = awaitChannelLeave();
            await sendCommand('leave');
            await promise;
        });
    });

    after(async function () {
        //Kick bot
        await botMember.voice.setChannel(null);

        //Kick self
        await selfMember.voice.setChannel(null);
    });
});
