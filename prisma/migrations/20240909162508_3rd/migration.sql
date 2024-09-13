/*
  Warnings:

  - A unique constraint covering the columns `[vacancyId]` on the table `Vacancy` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[position,deadline,gender,vacancyType,employementType]` on the table `Vacancy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vacancyId` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Vacancy` ADD COLUMN `vacancyId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Vacancy_vacancyId_key` ON `Vacancy`(`vacancyId`);

-- CreateIndex
CREATE UNIQUE INDEX `Vacancy_position_deadline_gender_vacancyType_employementType_key` ON `Vacancy`(`position`, `deadline`, `gender`, `vacancyType`, `employementType`);
