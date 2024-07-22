/*
  Warnings:

  - You are about to drop the column `updateAt` on the `point` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `point` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
