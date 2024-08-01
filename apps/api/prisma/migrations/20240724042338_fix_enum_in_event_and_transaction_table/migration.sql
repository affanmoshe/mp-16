/*
  Warnings:

  - You are about to alter the column `ticketType` on the `event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `promotionsId` on the `transaction` table. All the data in the column will be lost.
  - You are about to alter the column `paymentStatus` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `ticketType` ENUM('PAID', 'FREE') NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `promotionsId`,
    MODIFY `paymentStatus` ENUM('PAID', 'PENDING', 'FAILED', 'CANCELLED') NOT NULL;
