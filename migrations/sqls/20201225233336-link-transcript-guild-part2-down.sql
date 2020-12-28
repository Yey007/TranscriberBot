ALTER TABLE `transcription_channels` DROP FOREIGN KEY `transcription_channels_ibfk_1`;
ALTER TABLE `transcription_channels` MODIFY `guildId` varchar(20);