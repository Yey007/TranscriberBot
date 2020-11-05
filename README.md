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
* [NPM](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/en/)
* [Typescript](https://www.typescriptlang.org/)
    * Note: you can also install typescript with npm by running `npm install -g typescript`

## Installing Dependencies ##
1. Run `npm install`

## Compiling ##
1. Make sure you're in the root directory (should be called TranscriberBot)
2. Run `tsc` in the command line
3. Make sure a ts-built folder was created

## Creating Additional Files ##
A few other files are required that I didn't provide because they shouldn't be hosted publicly
1. Create a resources folder in root directory
    1. Create a file called bot.db
    2. Record an mp3 clip with just background noise (or anything really). This won't actually be
    heard by any users, but is necessary because the Discord API requires a user to send audio data
    before it can recieve any.
2. Create a file called .env in the root directory
    1. Obtain three pieces of information from various services this bot uses
        1. Discord - A bot token (beginner YouTube tutorials will cover this)
        2. IBM Watson - An API token for Watson Speech (this is a little complicated, so I can't cover it here)
        3. IBM Watson - A Watson Speech URL (same here, can't cover it)
    2. Put these in the .env file (replace placeholders like token with the token you obtained)
        1. Set the discord token like this: `BETTER_DEBATES_TOKEN=token`
        2. Set the API key like this: `WATSON_SPEECH_API_KEY=apikey`
        3. Set the URL like this: `WATSON_SPEECH_URL=url`

## Starting ##
1. Run `npm start` in the root directory
2. The bot should be running!

# Technologies Used #
I learned a lot of new stuff while making this bot. Here is everything I used:
1. Node.js
2. Typescript
3. Discord.js
4. Watson Speech API wrapper
5. SQLite
6. Docker