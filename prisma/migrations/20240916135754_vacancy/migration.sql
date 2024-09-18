-- CreateTable
CREATE TABLE `ApplicantInterviewScore` (
    `id` VARCHAR(191) NOT NULL,
    `IDNO` VARCHAR(191) NOT NULL,
    `totalScore` INTEGER NOT NULL,
    `maxScore` INTEGER NOT NULL,
    `applicantId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ApplicantInterviewScore_IDNO_key`(`IDNO`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicantInterview` (
    `id` VARCHAR(191) NOT NULL,
    `questions` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `min` INTEGER NOT NULL,
    `max` INTEGER NOT NULL,
    `applicantScoreId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApplicantInterviewScore` ADD CONSTRAINT `ApplicantInterviewScore_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicantInterview` ADD CONSTRAINT `ApplicantInterview_applicantScoreId_fkey` FOREIGN KEY (`applicantScoreId`) REFERENCES `ApplicantInterviewScore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
