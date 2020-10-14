import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {Bot} from "./bot";
import {Client} from "discord.js";
import { CommandExecutor } from "./services/commandexecutor";
import { ChannelJoiner } from "./services/commands/join";
import { HelpSender } from "./services/commands/help";
import { CommandMapper } from "./services/commandmapper";
import { Transcriber } from "./services/transcriber";
import SpeechToText from "ibm-watson/speech-to-text/v1"
import { IamAuthenticator } from 'ibm-watson/auth';

require('dotenv').config()

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();

container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.BETTER_DEBATES_TOKEN);

container.bind<string>(TYPES.WatsonAPIKey).toConstantValue(process.env.WATSON_SPEECH_API_KEY);
container.bind<string>(TYPES.WatsonURL).toConstantValue(process.env.WATSON_SPEECH_URL);
container.bind<SpeechToText>(TYPES.SpeechToText).toConstantValue(new SpeechToText({ 
    authenticator: new IamAuthenticator({apikey: process.env.WATSON_SPEECH_API_KEY}),
    version: "" //this doesn't seem to matter?
}));

container.bind<CommandMapper>(TYPES.CommandMapper).to(CommandMapper).inSingletonScope();
container.bind<CommandExecutor>(TYPES.CommandExecutor).to(CommandExecutor).inSingletonScope();
container.bind<Transcriber>(TYPES.Transcriber).to(Transcriber).inSingletonScope();

container.bind<ChannelJoiner>(TYPES.ChannelJoiner).to(ChannelJoiner).inSingletonScope();
container.bind<HelpSender>(TYPES.HelpSender).to(HelpSender).inSingletonScope();

export default container