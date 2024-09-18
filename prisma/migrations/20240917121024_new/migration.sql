/*
  Warnings:

  - Made the column `salary` on table `EmployeeWorkDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Applicant` MODIFY `maxScore` INTEGER NOT NULL DEFAULT 0,
    MODIFY `totalScore` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `EmployeeRelatedInfo` ADD COLUMN `emergencyContactName` VARCHAR(191) NULL,
    ADD COLUMN `emergencyContactPhone` VARCHAR(191) NULL,
    ADD COLUMN `emergencyContactRelation` VARCHAR(191) NULL,
    ADD COLUMN `familyBg` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `EmployeeWorkDetail` MODIFY `salary` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `EmployeeEducationalBackground` (
    `id` VARCHAR(191) NOT NULL,
    `institution` VARCHAR(191) NOT NULL,
    `qualification` VARCHAR(191) NOT NULL,
    `attachment` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmployeeEducationalBackground_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeWorkHistory` (
    `id` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmployeeWorkHistory_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `maxLeaveDate` VARCHAR(191) NOT NULL,
    `applicableAfter` DATETIME(3) NOT NULL,
    `repeat` DATETIME(3) NOT NULL,
    `withPay` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Holiday` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `totalDay` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeeEducationalBackground` ADD CONSTRAINT `EmployeeEducationalBackground_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeWorkHistory` ADD CONSTRAINT `EmployeeWorkHistory_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
