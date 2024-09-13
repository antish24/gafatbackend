-- AlterTable
ALTER TABLE `Branch` ADD COLUMN `status` ENUM('Active', 'InActive') NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE `Department` ADD COLUMN `status` ENUM('Active', 'InActive') NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE `Position` ADD COLUMN `status` ENUM('Active', 'InActive') NOT NULL DEFAULT 'Active';
