-- CreateTable
CREATE TABLE `EmployeeDiscipline` (
    `id` VARCHAR(191) NOT NULL,
    `IDNO` VARCHAR(191) NOT NULL,
    `incidentDate` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `attachment` VARCHAR(191) NULL,
    `employeeWorkId` VARCHAR(191) NOT NULL,
    `status` ENUM('Approved', 'Failed', 'Pending') NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmployeeDiscipline_IDNO_key`(`IDNO`),
    UNIQUE INDEX `EmployeeDiscipline_employeeWorkId_key`(`employeeWorkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Witnesses` (
    `id` VARCHAR(191) NOT NULL,
    `employeeWorkId` VARCHAR(191) NOT NULL,
    `employeeDisciplineId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocFile` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `typeId` VARCHAR(191) NOT NULL,
    `agreement` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeeDiscipline` ADD CONSTRAINT `EmployeeDiscipline_employeeWorkId_fkey` FOREIGN KEY (`employeeWorkId`) REFERENCES `EmployeeWorkDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Witnesses` ADD CONSTRAINT `Witnesses_employeeWorkId_fkey` FOREIGN KEY (`employeeWorkId`) REFERENCES `EmployeeWorkDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Witnesses` ADD CONSTRAINT `Witnesses_employeeDisciplineId_fkey` FOREIGN KEY (`employeeDisciplineId`) REFERENCES `EmployeeDiscipline`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocFile` ADD CONSTRAINT `DocFile_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `DocType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
