/*
  Warnings:

  - You are about to drop the column `location` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Vacancy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[positionId,deadline,gender,vacancyType,employementType]` on the table `Vacancy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicantId` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionId` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Vacancy_position_deadline_gender_vacancyType_employementType_key` ON `Vacancy`;

-- AlterTable
ALTER TABLE `Interview` ADD COLUMN `applicantId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Vacancy` DROP COLUMN `location`,
    DROP COLUMN `position`,
    ADD COLUMN `positionId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Vacancy_positionId_deadline_gender_vacancyType_employementTy_key` ON `Vacancy`(`positionId`, `deadline`, `gender`, `vacancyType`, `employementType`);

-- AddForeignKey
ALTER TABLE `Vacancy` ADD CONSTRAINT `Vacancy_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interview` ADD CONSTRAINT `Interview_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
