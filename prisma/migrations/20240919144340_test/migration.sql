-- CreateTable
CREATE TABLE `SalaryComponent` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('Earning', 'Deduction') NOT NULL,
    `pension` ENUM('Yes', 'No') NOT NULL,
    `tax` ENUM('Yes', 'Semi', 'No') NOT NULL,
    `semiTaxType` ENUM('Fixed', 'Percent') NOT NULL,
    `minNonTaxable` INTEGER NOT NULL,
    `applicableAfter` INTEGER NOT NULL,
    `conditionType` VARCHAR(191) NOT NULL,
    `status` ENUM('InActive', 'Active') NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SalaryComponent_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
