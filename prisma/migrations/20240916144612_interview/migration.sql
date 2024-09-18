/*
  Warnings:

  - You are about to drop the column `IDNO` on the `ApplicantInterviewScore` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `ApplicantInterviewScore_IDNO_key` ON `ApplicantInterviewScore`;

-- AlterTable
ALTER TABLE `ApplicantInterviewScore` DROP COLUMN `IDNO`;
