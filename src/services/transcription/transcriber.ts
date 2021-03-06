import { Readable } from 'stream';
import { Inject, Service } from 'typedi';
import { Logger } from '../logging/logger';
import { LogOrigin } from '../logging/logorigin';
import SpeechToText from 'ibm-watson/speech-to-text/v1';

@Service()
export class Transcriber {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public constructor(@Inject('speech-to-text') private stt: SpeechToText) {}

    public transcribe(stream: Readable, onTranscription: (words: string, err: unknown) => void): void {
        const params = {
            //sending raw pcm, watson claims to accept opus but couldn't get it to work, possibly because of container
            contentType: 'audio/l16;rate=48000;channels=2;endianness=little-endian;',
            objectMode: false
        };

        const recognizeStream = this.stt.recognizeUsingWebSocket(params);
        stream.pipe(recognizeStream);

        recognizeStream.on('data', function (data) {
            Logger.verbose('Recieved data from IBM', LogOrigin.Transcription);
            onTranscription(data.toString('utf-8'), undefined);
        });
        recognizeStream.on('error', function (err) {
            Logger.warn('Recieved error from IBM while attempting to transcribe', LogOrigin.Transcription);
            onTranscription('', err);
        });
    }
}
