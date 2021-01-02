/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

var dbm;
var type;
var seed;
var readFile = require('fs').readFile;
let fsAsync = require('fs').promises;
var join = require('path').join;
var Client = require('discord.js').Client;

var Promise;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function setup(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
    Promise = options.Promise;
};

exports.up = async function up(db) {
    var filePath = join(__dirname, 'sqls', '20201225213430-link-transcript-guild-up.sql');

    let data = await fsAsync.readFile(filePath, { encoding: 'utf-8' });
    console.log('received data: ' + data);

    let ret = db.runSql(data);
    let client = new Client();
    await client.login(process.env.DISCORD_TOKEN);

    let voiceIds = await db.runSql('SELECT voiceId FROM transcription_channels;');
    for (const element of voiceIds) {
        const channel = await client.channels.fetch(element.voiceId);
        db.runSql('UPDATE transcription_channels SET guildId=? WHERE voiceId=?', channel.guild.id, element.voiceId);
    }
    client.destroy();
    return ret;
};

exports.down = function down(db) {
    var filePath = join(__dirname, 'sqls', '20201225213430-link-transcript-guild-down.sql');
    return new Promise(function (resolve, reject) {
        readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
            if (err) return reject(err);
            console.log('received data: ' + data);

            resolve(data);
        });
    }).then(function (data) {
        return db.runSql(data);
    });
};

exports._meta = {
    version: 1
};
