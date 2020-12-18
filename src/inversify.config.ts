import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { Bot } from './bot';
import { Client } from 'discord.js';
import { CommandExecutor } from './services/interface/commandexecutor';
import { ChannelJoiner } from './services/interface/commands/join';
import { Transcriber } from './services/transcription/transcriber';
import SpeechToText from 'ibm-watson/speech-to-text/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import { TranscriptionSender } from './services/transcription/transcriptionsender';
import { RecPermissionGetter } from './services/transcription/recpermissiongetter';
import { StandardEmbedMaker } from './services/misc/standardembedmaker';
import { ChannelLeaver } from './services/interface/commands/leave';
import { MainCommandMapper } from './services/interface/commandmapper';
import { TranscriptionManager } from './services/transcription/transcriptionmanager';
import { DbUserSettingsRepository } from './services/repositories/usersettings/dbusersettingsrepository';
import { DbGuildSettingsRespository } from './services/repositories/guildsettings/dbguildsettingsrepository';
import { SetTranscriptChannel } from './services/interface/commands/settranscriptchannel';
import { Help } from './services/interface/commands/help';
import { TranscriptionChannelGetter } from './services/transcription/transcriptionchannelgetter';
import { SetRecordingPermission } from './services/interface/commands/recordingpermission';
import { Prefix } from './services/interface/commands/prefix';
import { createConnection } from 'mysql2';
import { Connection } from 'mysql2/promise';
import env from 'dotenv';
import { SettingsRepository } from './services/repositories/settingsrepository';
import { UserSettings } from './services/repositories/usersettings/usersettings';
import { GuildSettings } from './services/repositories/guildsettings/guildsettings';
import { DbTranscriptChanRepository } from './services/repositories/transcriptionchannels/dbtranscriptchanrepository';
import { RoleManager } from './services/permissions/rolemanager';
import { Logger } from './services/logging/logger';
import { LogOrigin } from './services/logging/logorigin';

//Load env files if we're not in a container. That file will be passed as an argument to docker if we're running docker.
if (process.env.CONTAINER !== 'true') {
    env.config({ path: 'bot.env' });
    env.config({ path: 'db.env' });
}

export const container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.DISCORD_TOKEN);

container.bind<string>(TYPES.WatsonAPIKey).toConstantValue(process.env.WATSON_SPEECH_API_KEY);
container.bind<string>(TYPES.WatsonURL).toConstantValue(process.env.WATSON_SPEECH_URL);
container.bind<SpeechToText>(TYPES.SpeechToText).toConstantValue(
    new SpeechToText({
        authenticator: new IamAuthenticator({ apikey: process.env.WATSON_SPEECH_API_KEY }),
        version: '' //this doesn't seem to matter?
    })
);

container.bind<CommandExecutor>(TYPES.CommandExecutor).to(CommandExecutor).inSingletonScope();
container.bind<MainCommandMapper>(TYPES.CommandMapper).to(MainCommandMapper).inSingletonScope();

container.bind<Transcriber>(TYPES.Transcriber).to(Transcriber).inSingletonScope();
container.bind<TranscriptionSender>(TYPES.TranscriptionSender).to(TranscriptionSender).inSingletonScope();
container.bind<TranscriptionManager>(TYPES.TranscriptionManager).to(TranscriptionManager).inSingletonScope();
container.bind<RecPermissionGetter>(TYPES.PermissionGetter).to(RecPermissionGetter).inSingletonScope();
container
    .bind<TranscriptionChannelGetter>(TYPES.TranscriptionChannelGetter)
    .to(TranscriptionChannelGetter)
    .inSingletonScope();
container.bind<StandardEmbedMaker>(TYPES.StandardEmbedMaker).to(StandardEmbedMaker).inSingletonScope();

const conn = createConnection({
    host: 'db',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).on('error', (err) => {
    // Only applies to initial connection
    Logger.error(err.code, LogOrigin.MySQL);
});

container.bind<Connection>(TYPES.Database).toConstantValue(conn.promise());
container
    .bind<SettingsRepository<UserSettings>>(TYPES.UserSettingsRepository)
    .to(DbUserSettingsRepository)
    .inSingletonScope();
container
    .bind<SettingsRepository<GuildSettings>>(TYPES.GuildSettingsRepository)
    .to(DbGuildSettingsRespository)
    .inSingletonScope();
container
    .bind<SettingsRepository<string>>(TYPES.TranscriptionChannelRespository)
    .to(DbTranscriptChanRepository)
    .inSingletonScope();

container.bind<ChannelJoiner>(TYPES.ChannelJoiner).to(ChannelJoiner).inSingletonScope();
container.bind<ChannelLeaver>(TYPES.ChannelLeaver).to(ChannelLeaver).inSingletonScope();
container.bind<SetTranscriptChannel>(TYPES.SetTranscriptChannel).to(SetTranscriptChannel).inSingletonScope();
container.bind<SetRecordingPermission>(TYPES.SetRecordingPermission).to(SetRecordingPermission).inSingletonScope();
container.bind<Help>(TYPES.Help).to(Help).inSingletonScope();
container.bind<Prefix>(TYPES.SetPrefix).to(Prefix).inSingletonScope();

container.bind<RoleManager>(TYPES.RoleManager).to(RoleManager).inSingletonScope();
