ALTER TABLE `transcription_channels` ADD FOREIGN KEY `guild_link`(`guildId`) REFERENCES `guild_settings`(`id`);