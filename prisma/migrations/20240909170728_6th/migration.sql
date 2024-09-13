/*
  Warnings:

  - You are about to drop the column `vacancyId` on the `Vacancy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[IDNO]` on the table `Vacancy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IDNO` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Vacancy_vacancyId_key` ON `Vacancy`;

-- AlterTable
ALTER TABLE `Vacancy` DROP COLUMN `vacancyId`,
    ADD COLUMN `IDNO` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Vacancy_IDNO_key` ON `Vacancy`(`IDNO`);
