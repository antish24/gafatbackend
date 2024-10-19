/*
  Warnings:

  - A unique constraint covering the columns `[year,employeeId]` on the table `LeaveBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `LeaveApplication` ADD COLUMN `attachment` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LeaveBalance` ADD COLUMN `status` ENUM('Active', 'Expired') NOT NULL DEFAULT 'Active',
    ADD COLUMN `year` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `LeaveAllocation` (
    `id` VARCHAR(191) NOT NULL,
    `startMonth` DATETIME(3) NOT NULL,
    `endMonth` DATETIME(3) NOT NULL,
    `count` INTEGER NOT NULL,
    `used` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LeaveAllocation_startMonth_endMonth_key`(`startMonth`, `endMonth`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `LeaveBalance_year_employeeId_key` ON `LeaveBalance`(`year`, `employeeId`);
