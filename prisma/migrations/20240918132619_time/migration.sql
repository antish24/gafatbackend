/*
  Warnings:

  - You are about to drop the column `workDetailId` on the `TimeSheet` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `TimeSheet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TimeSheet` DROP FOREIGN KEY `TimeSheet_workDetailId_fkey`;

-- AlterTable
ALTER TABLE `TimeSheet` DROP COLUMN `workDetailId`,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TimeSheet` ADD CONSTRAINT `TimeSheet_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `EmployeeProject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
