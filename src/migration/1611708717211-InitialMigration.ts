import { Service } from 'typedi';
import { MigrationInterface, QueryRunner } from 'typeorm';

@Service()
export class InitialMigration1611708717211 implements MigrationInterface {
    name = 'InitialMigration1611708717211';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('migrations');

        await queryRunner.renameTable('guild_settings', 'guild_settings_old');
        await queryRunner.query(
            'CREATE TABLE `guild_settings` (`guildId` varchar(20) NOT NULL, `prefix` varchar(5) NOT NULL, PRIMARY KEY (`guildId`)) ENGINE=InnoDB'
        );
        await queryRunner.query(
            'INSERT INTO `guild_settings` (`guildId`, `prefix`) SELECT `id`, `prefix` FROM `guild_settings_old`'
        );

        await queryRunner.renameTable('transcription_channels', 'transcription_channels_old');
        await queryRunner.query(
            'CREATE TABLE `transcription_pair` (`voiceId` varchar(20) NOT NULL, `textId` varchar(20) NOT NULL, `guildId` varchar(20) NOT NULL, PRIMARY KEY (`voiceId`)) ENGINE=InnoDB'
        );
        await queryRunner.query(
            'INSERT INTO `transcription_pair` (`voiceId`, `textId`, `guildId`) SELECT `voiceId`, `textId`, `guildId` FROM `transcription_channels_old`'
        );

        await queryRunner.renameTable('user_settings', 'user_settings_old');
        await queryRunner.query(
            "CREATE TABLE `user_settings` (`userId` varchar(20) NOT NULL, `permission` enum ('0', '1', '2') NOT NULL DEFAULT '0', PRIMARY KEY (`userId`)) ENGINE=InnoDB"
        );
        await queryRunner.query(
            'INSERT INTO `user_settings` (`userId`, `permission`) SELECT `id`, `permission` FROM `user_settings_old`'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `user_settings`');
        await queryRunner.query('DROP TABLE `transcription_pair`');
        await queryRunner.query('DROP TABLE `guild_settings`');

        await queryRunner.renameTable('guild_settings_old', 'guild_settings');
        await queryRunner.renameTable('transcription_channels_old', 'transcription_channels');
        await queryRunner.renameTable('user_settings_old', 'user_settings');
    }
}
