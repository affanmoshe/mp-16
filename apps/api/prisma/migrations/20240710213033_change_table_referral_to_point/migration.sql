/*
  Warnings:

  - You are about to drop the column `firstname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `pointsBalance` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `referral` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `referral` DROP FOREIGN KEY `Referral_referralCodeOwner_fkey`;

-- DropForeignKey
ALTER TABLE `referral` DROP FOREIGN KEY `Referral_referralUserId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `firstname`,
    DROP COLUMN `lastname`,
    DROP COLUMN `pointsBalance`,
    ADD COLUMN `referrerId` INTEGER NULL;

-- DropTable
DROP TABLE `referral`;

-- CreateTable
CREATE TABLE `Point` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pointsEarned` INTEGER NOT NULL,
    `pointsRemaining` INTEGER NOT NULL,
    `pointsExpiry` DATETIME(3) NOT NULL,
    `pointsOwnerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referrerId_fkey` FOREIGN KEY (`referrerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Point` ADD CONSTRAINT `Point_pointsOwnerId_fkey` FOREIGN KEY (`pointsOwnerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
