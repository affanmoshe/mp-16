/*
  Warnings:

  - You are about to drop the column `points_balance` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `referral_code` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `samples` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pointsBalance` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_role_id_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `points_balance`,
    DROP COLUMN `referral_code`,
    DROP COLUMN `role_id`,
    ADD COLUMN `pointsBalance` INTEGER NOT NULL,
    ADD COLUMN `referralCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `roleId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `samples`;

-- CreateIndex
CREATE UNIQUE INDEX `User_referralCode_key` ON `User`(`referralCode`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
