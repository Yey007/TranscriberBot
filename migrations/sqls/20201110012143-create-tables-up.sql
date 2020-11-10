/* Copy paste from SHOW CREATE TABLE ____ (with unnecessary stuff removed) */
CREATE TABLE `guild_settings` (
  `id` varchar(20) NOT NULL,
  `prefix` varchar(5) NOT NULL DEFAULT '!',
  PRIMARY KEY (`id`)
);
CREATE TABLE `user_settings` (
  `id` varchar(20) NOT NULL,
  `permission` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `enum_permission` CHECK (((`permission` >= 0) and (`permission` <= 2)))
);
CREATE TABLE `transcription_channels` (
  `voiceId` varchar(20) NOT NULL,
  `textId` varchar(20) NOT NULL,
  PRIMARY KEY (`voiceId`)
);