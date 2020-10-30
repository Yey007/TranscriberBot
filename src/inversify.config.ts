import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { Bot } from "./bot";
import { Client } from "discord.js";
import { CommandExecutor } from "./services/commands/commandexecutor";
import { ChannelJoiner } from "./services/commands/join";
import { HelpSender } from "./services/commands/help";
import { Transcriber } from "./services/transcription/transcriber";
import SpeechToText from "ibm-watson/speech-to-text/v1"
import { IamAuthenticator } from 'ibm-watson/auth';
import { TranscriptionSender } from "./services/transcription/transcriptionsender";
import { PermissionGetter } from "./services/transcription/permissiongetter";
import { StandardEmbedMaker } from "./services/misc/standardembedmaker";
import { ChannelLeaver } from "./services/commands/leave";
import env from "dotenv"
import { CommandMapper } from "./services/commands/commandmapper";
import { TranscriptionManager } from "./services/transcription/transcriptionmanager";
import { AbstractPermissionRepository } from "./services/repositories/permission/abstractpermissionrepository";
import { DbPermissionRepository } from "./services/repositories/permission/dbpermissionrepository";
import { Database } from "sqlite3";
import { AbstractGuildSettingsRepository } from "./services/repositories/guildsettings/abstractguildsettingsrepository";
import { DbGuildSettingsRespository } from "./services/repositories/guildsettings/dbguildsettingsrepository";
import { SetTranscriptChannel } from "./services/commands/settranscriptchannel";
import { Commands } from "./services/commands/commands";
import { TranscriptionChannelGetter } from "./services/transcription/transcriptionchannelgetter";
import { SetRecordingPermission } from "./services/commands/setrecordingpermission";

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
container.bind<CommandMapper>(TYPES.CommandMapper).to(CommandMapper).inSingletonScope();

container.bind<Transcriber>(TYPES.Transcriber).to(Transcriber).inSingletonScope();
container.bind<TranscriptionSender>(TYPES.TranscriptionSender).to(TranscriptionSender).inSingletonScope();
container.bind<TranscriptionManager>(TYPES.TranscriptionManager).to(TranscriptionManager).inSingletonScope();
container.bind<PermissionGetter>(TYPES.PermissionGetter).to(PermissionGetter).inSingletonScope();
container.bind<TranscriptionChannelGetter>(TYPES.TranscriptionChannelGetter).to(TranscriptionChannelGetter).inSingletonScope();
container.bind<StandardEmbedMaker>(TYPES.StandardEmbedMaker).to(StandardEmbedMaker).inSingletonScope();

container.bind<Database>(TYPES.Database).toConstantValue(new Database("resources/bot.db"))
container.bind<AbstractPermissionRepository>(TYPES.PermissionRepository).to(DbPermissionRepository).inSingletonScope();
container.bind<AbstractGuildSettingsRepository>(TYPES.GuildSettingsRepository).to(DbGuildSettingsRespository).inSingletonScope();

container.bind<ChannelJoiner>(TYPES.ChannelJoiner).to(ChannelJoiner).inSingletonScope();
container.bind<HelpSender>(TYPES.HelpSender).to(HelpSender).inSingletonScope();
container.bind<ChannelLeaver>(TYPES.ChannelLeaver).to(ChannelLeaver).inSingletonScope();
container.bind<SetTranscriptChannel>(TYPES.SetTranscriptChannel).to(SetTranscriptChannel).inSingletonScope();
container.bind<SetRecordingPermission>(TYPES.SetRecordingPermission).to(SetRecordingPermission).inSingletonScope();
container.bind<Commands>(TYPES.Commands).to(Commands).inSingletonScope();