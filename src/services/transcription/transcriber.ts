import { inject, injectable } from "inversify";
import { Readable } from "stream";
import { TYPES } from "../../types";

@injectable()
export class Transcriber {

    private stt: any

    public constructor(
        @inject(TYPES.SpeechToText) stt)
    {
        this.stt = stt
    }

    public transcribe(stream: Readable, onTranscription: (words: string, err: any) => void): void {

        const params = {
            //sending raw pcm, watson claims to accept opus but couldn't get it to work, possibly because of container
            contentType: 'audio/l16;rate=48000;channels=2;endianness=little-endian;',
            objectMode: false
        };

        let recognizeStream = this.stt.recognizeUsingWebSocket(params)
        stream.pipe(recognizeStream)

        recognizeStream.on('data', function (data) {
            onTranscription(data.toString("utf-8"), undefined)
        });
        recognizeStream.on('error', function (err) {
            onTranscription("", err)
        });
    }
}