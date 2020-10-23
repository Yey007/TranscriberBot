import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { Bot } from "./bot";
import { Client } from "discord.js";
import { CommandExecutor } from "./services/commandexecutor";
import { ChannelJoiner } from "./services/commands/join";
import { HelpSender } from "./services/commands/help";
import { Transcriber } from "./services/transcriber";
import SpeechToText from "ibm-watson/speech-to-text/v1"
import { IamAuthenticator } from 'ibm-watson/auth';
import { TranscriptionSender } from "./services/transcriptionsender";
import { PermissionGetter } from "./services/consentgetter";
import { StandardEmbedMaker } from "./services/standardembedmaker";
import { ChannelLeaver } from "./services/commands/leave";
import env from "dotenv"
import { CommandMapper } from "./services/commandmapper";
import { TranscriptionManager } from "./services/transcriptionmanager";
import { ConsentRepository } from "./services/consentrepository";

env.config()

export let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();

container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.BETTER_DEBATES_TOKEN);

container.bind<string>(TYPES.WatsonAPIKey).toConstantValue(process.env.WATSON_SPEECH_API_KEY);
container.bind<string>(TYPES.WatsonURL).toConstantValue(process.env.WATSON_SPEECH_URL);
container.bind<SpeechToText>(TYPES.SpeechToText).toConstantValue(new SpeechToText({ 
    authenticator: new IamAuthenticator({apikey: process.env.WATSON_SPEECH_API_KEY}),
    version: "" //this doesn't seem to matter?
}));

container.bind<CommandExecutor>(TYPES.CommandExecutor).to(CommandExecutor).inSingletonScope();
container.bind<Transcriber>(TYPES.Transcriber).to(Transcriber).inSingletonScope();
container.bind<TranscriptionSender>(TYPES.TranscriptionSender).to(TranscriptionSender).inSingletonScope();
container.bind<PermissionGetter>(TYPES.ConsentGetter).to(PermissionGetter).inSingletonScope();
container.bind<StandardEmbedMaker>(TYPES.StandardEmbedMaker).to(StandardEmbedMaker).inSingletonScope();
container.bind<CommandMapper>(TYPES.CommandMapper).to(CommandMapper).inSingletonScope();
container.bind<TranscriptionManager>(TYPES.TranscriptionManager).to(TranscriptionManager).inSingletonScope();
container.bind<ConsentRepository>(TYPES.ConsentRepository).to(ConsentRepository).inSingletonScope();

container.bind<ChannelJoiner>(TYPES.ChannelJoiner).to(ChannelJoiner).inSingletonScope();
container.bind<HelpSender>(TYPES.HelpSender).to(HelpSender).inSingletonScope();
container.bind<ChannelLeaver>(TYPES.ChannelLeaver).to(ChannelLeaver).inSingletonScope();