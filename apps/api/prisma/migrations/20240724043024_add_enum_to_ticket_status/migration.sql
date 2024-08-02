/*
  Warnings:

  - You are about to alter the column `status` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `ticket` MODIFY `status` ENUM('BOOKED', 'CHECKED_IN', 'CANCELLED') NOT NULL;
