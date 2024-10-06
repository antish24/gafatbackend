-- CreateTable
CREATE TABLE `Agreement` (
    `id` VARCHAR(191) NOT NULL,
    `IDNO` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `positionId` VARCHAR(191) NOT NULL,
    `status` ENUM('Active', 'InActive') NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Agreement_IDNO_key`(`IDNO`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Articles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `agreementId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agreement` ADD CONSTRAINT `Agreement_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Articles` ADD CONSTRAINT `Articles_agreementId_fkey` FOREIGN KEY (`agreementId`) REFERENCES `Agreement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
