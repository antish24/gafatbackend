-- AlterTable
ALTER TABLE `Interview` ADD COLUMN `status` ENUM('Active', 'InActive') NOT NULL DEFAULT 'Active';
