/*
  Warnings:

  - A unique constraint covering the columns `[IDNO]` on the table `SystemUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IDNO` to the `SystemUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SystemUser` ADD COLUMN `IDNO` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('Active', 'InActive') NOT NULL DEFAULT 'Active',
    ADD COLUMN `token` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SystemUser_IDNO_key` ON `SystemUser`(`IDNO`);
