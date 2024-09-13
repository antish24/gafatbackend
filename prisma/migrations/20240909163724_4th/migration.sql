-- AlterTable
ALTER TABLE `Vacancy` MODIFY `status` ENUM('Open', 'Closed') NOT NULL DEFAULT 'Open';
