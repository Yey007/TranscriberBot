'use strict'
const mysql2 = require("mysql2")

let conn = mysql2.createConnection({
  host     : 'localhost',
  user     : 'transcriberbot',
  password : process.env.MYSQL_PASSWORD,
  database : 'transcriberbot'
}).promise()

module.exports.up = async function (next) {
	try {
		await conn.query(`CREATE TABLE guild_settings(
			id varchar(20) NOT NULL,
			prefix varchar(5) NOT NULL DEFAULT '!',
			PRIMARY KEY (id))`)
	} catch(err) {
		console.log(err.sqlMessage)
	}

	try {
		await conn.query(`CREATE TABLE user_settings (
			id varchar(20) NOT NULL,
			permission int NOT NULL DEFAULT '0',
			PRIMARY KEY (id),
			CONSTRAINT enum_permission CHECK (((permission >= 0) and (permission <= 2))))`)
	} catch(err) {
		console.log(err.sqlMessage)
	}

	try {
		await conn.query(`CREATE TABLE transcription_channels (
			voiceId varchar(20) NOT NULL,
			textId varchar(20) NOT NULL,
			PRIMARY KEY (voiceId))`)
	} catch(err) {
		console.log(err.sqlMessage)
	}
}

module.exports.down = async function (next) {
	try {
		await conn.query(`DROP TABLE guild_settings`)
	} catch(err) {
		console.log(err.sqlMessage)
	}

	try {
		await conn.query(`DROP TABLE user_settings`)
	} catch(err) {
		console.log(err.sqlMessage)
	}
	
	try {
		await conn.query(`DROP TABLE transcription_channels`)
	} catch(err) {
		console.log(err.sqlMessage)
	}
	
}
