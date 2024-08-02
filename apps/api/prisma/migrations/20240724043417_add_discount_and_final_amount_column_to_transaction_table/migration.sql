/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `totalAmount`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `discount` INTEGER NOT NULL,
    ADD COLUMN `finalAmount` INTEGER NOT NULL;
