/*
  Warnings:

  - You are about to drop the column `projectId` on the `TimeSheet` table. All the data in the column will be lost.
  - Added the required column `employeeProjectId` to the `TimeSheet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TimeSheet` DROP FOREIGN KEY `TimeSheet_projectId_fkey`;

-- AlterTable
ALTER TABLE `TimeSheet` DROP COLUMN `projectId`,
    ADD COLUMN `employeeProjectId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TimeSheet` ADD CONSTRAINT `TimeSheet_employeeProjectId_fkey` FOREIGN KEY (`employeeProjectId`) REFERENCES `EmployeeProject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
