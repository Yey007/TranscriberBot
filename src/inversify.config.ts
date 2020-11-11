import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { Bot } from "./bot";
import { Client } from "discord.js";
import { CommandExecutor } from "./services/commands/commandexecutor";
import { ChannelJoiner } from "./services/commands/join";
import { About } from "./services/commands/about";
import { Transcriber } from "./services/transcription/transcriber";
import SpeechToText, { RecognizeConstants } from "ibm-watson/speech-to-text/v1"
import { IamAuthenticator } from 'ibm-watson/auth';
import { TranscriptionSender } from "./services/transcription/transcriptionsender";
import { PermissionGetter } from "./services/transcription/permissiongetter";
import { StandardEmbedMaker } from "./services/misc/standardembedmaker";
import { ChannelLeaver } from "./services/commands/leave";
import { CommandMapper } from "./services/commands/commandmapper";
import { TranscriptionManager } from "./services/transcription/transcriptionmanager";
import { DbUserSettingsRepository } from "./services/repositories/usersettings/dbusersettingsrepository";
import { DbGuildSettingsRespository } from "./services/repositories/guildsettings/dbguildsettingsrepository";
import { SetTranscriptChannel } from "./services/commands/settranscriptchannel";
import { Help } from "./services/commands/help";
import { TranscriptionChannelGetter } from "./services/transcription/transcriptionchannelgetter";
import { SetRecordingPermission } from "./services/commands/setrecordingpermission";
import { SetPrefix } from "./services/commands/setprefix";
import { createConnection } from "mysql2"
import { Connection } from "mysql2/promise"
import env from "dotenv"
import { SettingsRepository } from "./services/repositories/settingsrepository";
import { UserSettings } from "./services/repositories/usersettings/usersettings";
import { GuildSettings } from "./services/repositories/guildsettings/guildsettings";
import { DbTranscriptChanRepository } from "./services/repositories/transcriptionchannels/dbtranscriptchanrepository";

//Load env file if we're not in a container. That file will be passed as an argument to docker if we're running docker.
/*
if(process.env.CONTAINER !== "true") {
    env.config()
}
*/

export let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.DISCORD_TOKEN);

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

// If we're in docker, this will likely crash the process multiple times.
// That is fine. I really don't want to implement a try retry loop due to it being difficult with callbacks
let conn = createConnection({
    host: "db",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

container.bind<Connection>(TYPES.Database).toConstantValue(conn.promise())
container.bind<SettingsRepository<UserSettings>>(TYPES.UserSettingsRepository).to(DbUserSettingsRepository).inSingletonScope();
container.bind<SettingsRepository<GuildSettings>>(TYPES.GuildSettingsRepository).to(DbGuildSettingsRespository).inSingletonScope();
container.bind<SettingsRepository<string>>(TYPES.TranscriptionChannelRespository).to(DbTranscriptChanRepository).inSingletonScope();

container.bind<ChannelJoiner>(TYPES.ChannelJoiner).to(ChannelJoiner).inSingletonScope();
container.bind<About>(TYPES.About).to(About).inSingletonScope();
container.bind<ChannelLeaver>(TYPES.ChannelLeaver).to(ChannelLeaver).inSingletonScope();
container.bind<SetTranscriptChannel>(TYPES.SetTranscriptChannel).to(SetTranscriptChannel).inSingletonScope();
container.bind<SetRecordingPermission>(TYPES.SetRecordingPermission).to(SetRecordingPermission).inSingletonScope();
container.bind<Help>(TYPES.Help).to(Help).inSingletonScope();
container.bind<SetPrefix>(TYPES.SetPrefix).to(SetPrefix).inSingletonScope();