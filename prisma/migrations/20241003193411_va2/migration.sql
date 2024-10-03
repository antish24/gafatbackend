/*
  Warnings:

  - You are about to drop the column `applicantId` on the `Interview` table. All the data in the column will be lost.
  - Added the required column `positionId` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Interview` DROP FOREIGN KEY `Interview_applicantId_fkey`;

-- AlterTable
ALTER TABLE `Interview` DROP COLUMN `applicantId`,
    ADD COLUMN `positionId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Interview` ADD CONSTRAINT `Interview_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
