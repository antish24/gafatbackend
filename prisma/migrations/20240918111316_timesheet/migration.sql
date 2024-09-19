-- CreateTable
CREATE TABLE `TimeSheet` (
    `id` VARCHAR(191) NOT NULL,
    `workDetailId` VARCHAR(191) NOT NULL,
    `regularPH` INTEGER NOT NULL,
    `regularPOTH` INTEGER NOT NULL,
    `specialPH` INTEGER NOT NULL,
    `OT32` INTEGER NOT NULL,
    `totalHours` INTEGER NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Failed') NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TimeSheet_workDetailId_key`(`workDetailId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TimeSheet` ADD CONSTRAINT `TimeSheet_workDetailId_fkey` FOREIGN KEY (`workDetailId`) REFERENCES `EmployeeWorkDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
