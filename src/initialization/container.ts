import { IamAuthenticator } from 'ibm-watson/auth';
import Container from 'typedi';
import { useContainer } from 'typeorm';
import SpeechToText from 'ibm-watson/speech-to-text/v1';
import { Client } from 'discord.js';

export function containerInit(): void {
    Container.set(
        'speech-to-text',
        new SpeechToText({
            authenticator: new IamAuthenticator({ apikey: process.env.WATSON_SPEECH_API_KEY }),
            version: '' //this doesn't seem to matter?
        })
    );
    Container.set('discord_client', new Client());
    Container.set('discord_token', process.env.DISCORD_TOKEN);

    useContainer(Container, {});
}
