ALTER TABLE `transcription_channels` MODIFY `guildId` varchar(20) NOT NULL;
ALTER TABLE `transcription_channels` ADD FOREIGN KEY `guild_link`(`guildId`) REFERENCES `guild_settings`(`id`);