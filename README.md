# TranscriberBot

Should you allow it, TranscriberBot can transcribe all of your words with *reasonable* accuracy. It's useful for
anything from allowing deaf friends to tune in to your conversations to writing down important conversations
for future reference. You can add it to your server with the link below. 

https://discord.com/api/oauth2/authorize?client_id=762374209867087882&permissions=36703232&scope=bot

# Getting Started #

Hop into a channel and run the `!join` command. The bot will join your channel and will be ready to transcribe
audio. Once you speak, it will ask for your permission to listen to your voice. If you accept, it will start
transcribing in the first channel it finds that it can send messages to. In order to change this, simply issue the
`set-transcript-chan` command followed by the name of the voice channel you're in. This will set the channel you
sent the message in as the transcription channel for the voice channel. 

You're ready to go! Type `!help` to earn about other commands.

# Running #

## Prerequisites ##
* [Docker](https://www.docker.com/)

## Setting Up MySQL ##
I will be assuming you have some knowledge of how to set up MySQL.
1. Create a new database called `transcriberbot`
2. Create a user called `transcriber` with any password you choose
3. Grant all permission on `transcriberbot` to `transcriber`
4. Run 
```
CREATE TABLE `user_settings` (`id` varchar(20) NOT NULL, `permission` int NOT NULL DEFAULT '0', PRIMARY KEY (`id`),
CONSTRAINT `enum_permission` CHECK (((`permission` >= 0) and (`permission` <= 2)))) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
5. Run 
```
CREATE TABLE `guild_settings` (`id` varchar(20) NOT NULL, `prefix` varchar(5) NOT NULL DEFAULT '!', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
6. Run 
```
CREATE TABLE `transcription_channels` (`voiceId` varchar(20) NOT NULL, `textId` varchar(20) NOT NULL,
`guildId` varchar(20) NOT NULL, PRIMARY KEY (`voiceId`), KEY `guildId` (`guildId`),
CONSTRAINT `transcription_channels_ibfk_1` FOREIGN KEY (`guildId`) REFERENCES `guild_settings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
7. Check back here in a while, this may become easier if I start running mysql in a docker contianer

## Obtaining Secrets ##
I can't go into details here, but you need to obtain these secrets. There are tons of tutorials for discord bots and IBM covers using Speech-To-Text pretty well.
1. A Discord bot token
2. An IBM Speech-To-Text API key
3. An IBM Speech-To-Text URL

## Creating Neccessary Files ##
1. In the directory you're going to run the contianer in, create a file called bot.env
2. Make your file look like this: (replace placeholders with the value you obtained)
```
DISCORD_TOKEN=your_token
WATSON_SPEECH_API_KEY=your_api_key
WATSON_SPEECH_URL=your_url
MYSQL_PASSWORD=the_password_you_set
```
3. If you're running the container on linux, add this line
```
HOST_OS=linux
```

## Running ##
### Windows ###
Run `sudo docker run --env-file bot.env -d yey007/transcriberbot`
### Linux ###
Run `sudo docker run --env-file bot.env --net=host -d yey007/transcriberbot`

You're good to go :)

# Technologies Used #
I learned a lot of new stuff while making this bot. Here is everything I used:
1. Node.js
2. Typescript
3. Discord.js
4. Watson Speech API wrapper
5. MySQL
6. Docker