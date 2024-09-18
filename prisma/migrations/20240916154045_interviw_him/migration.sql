/*
  Warnings:

  - You are about to drop the column `applicantScoreId` on the `ApplicantInterview` table. All the data in the column will be lost.
  - You are about to drop the `ApplicantInterviewScore` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `maxScore` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalScore` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicantId` to the `ApplicantInterview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ApplicantInterview` DROP FOREIGN KEY `ApplicantInterview_applicantScoreId_fkey`;

-- DropForeignKey
ALTER TABLE `ApplicantInterviewScore` DROP FOREIGN KEY `ApplicantInterviewScore_applicantId_fkey`;

-- AlterTable
ALTER TABLE `Applicant` ADD COLUMN `maxScore` INTEGER NOT NULL,
    ADD COLUMN `totalScore` INTEGER NOT NULL,
    MODIFY `status` ENUM('Pending', 'Hired', 'Fail', 'Waiting') NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE `ApplicantInterview` DROP COLUMN `applicantScoreId`,
    ADD COLUMN `applicantId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `ApplicantInterviewScore`;

-- AddForeignKey
ALTER TABLE `ApplicantInterview` ADD CONSTRAINT `ApplicantInterview_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
