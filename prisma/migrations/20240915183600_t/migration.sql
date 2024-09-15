/*
  Warnings:

  - You are about to drop the column `interview` on the `Vacancy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[IDNO]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IDNO` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interviewId` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Applicant` ADD COLUMN `IDNO` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Vacancy` DROP COLUMN `interview`,
    ADD COLUMN `interviewId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Applicant_IDNO_key` ON `Applicant`(`IDNO`);

-- AddForeignKey
ALTER TABLE `Vacancy` ADD CONSTRAINT `Vacancy_interviewId_fkey` FOREIGN KEY (`interviewId`) REFERENCES `Interview`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
