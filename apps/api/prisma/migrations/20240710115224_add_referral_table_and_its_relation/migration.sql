-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referralCodeOwner` VARCHAR(191) NOT NULL,
    `referralUserId` INTEGER NOT NULL,
    `pointsEarned` INTEGER NOT NULL,
    `pointsExpiry` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Referral_referralUserId_key`(`referralUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referralCodeOwner_fkey` FOREIGN KEY (`referralCodeOwner`) REFERENCES `User`(`referralCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Referral` ADD CONSTRAINT `Referral_referralUserId_fkey` FOREIGN KEY (`referralUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
