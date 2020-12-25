ALTER TABLE `transcription_channels` DROP FOREIGN KEY `guild_link`;
ALTER TABLE `transcription_channels` MODIFY `guildId` varchar(20);