/*
  Warnings:

  - You are about to drop the column `image` on the `EmployeeFingerPrint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `EmployeeFingerPrint` DROP COLUMN `image`,
    MODIFY `features` VARCHAR(191) NOT NULL;
