-- CreateTable
CREATE TABLE `Promotion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `discountAmount` INTEGER NOT NULL,
    `usageLimit` INTEGER NOT NULL,
    `validFrom` DATETIME(3) NOT NULL,
    `validTo` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Promotion_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
