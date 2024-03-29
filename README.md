[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/yey007/TranscriberBot/Docker?label=Build&logo=Github)](https://github.com/Yey007/TranscriberBot/actions)

# TranscriberBot

Should you allow it, TranscriberBot can transcribe all of your words with *reasonable* accuracy. It's useful for
anything from allowing deaf friends to tune in to your conversations to writing down important conversations
for future reference. 

Unfortunately, the bot is no longer deployed, but feel free to run your own instance.

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
* [docker-compose](https://docs.docker.com/compose/install/)

## Obtaining Secrets ##
I can't go into details here, but you need to obtain the following secrets. There are tons of tutorials for discord bots and IBM covers using Speech-To-Text pretty well.
1. A Discord bot token
2. An IBM Speech-To-Text API key
3. An IBM Speech-To-Text URL

## Creating Neccessary Files ##
1. In the directory you're going to run the contianer app in, create a file called bot.env
2. Make your file look like this: (replace placeholders with the value you obtained)
```
DISCORD_TOKEN=your_token
WATSON_SPEECH_API_KEY=your_api_key
WATSON_SPEECH_URL=your_url
```
3. Create another file called db.env
4. Make the file look like this (you can replace or leave these placeholders)
```
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_PASSWORD=password
MYSQL_DATABASE=transcriberbot
MYSQL_USER=bot
```
5. Copy paste (or download) the docker-compose file in this repo. Modify it to your own need (you can remove adminer, for example).
## Running ##
Run `docker-compose up`
Note: You may need to run with sudo/privileged if that doesn't work

You're good to go :)

# Technologies Used #
I learned a lot of new stuff while making this bot. Here is everything I used:
1. Node.js
2. Typescript
3. Discord.js
4. Watson Speech API wrapper
5. MySQL
6. Docker
7. Github Actions
