/*
  Warnings:

  - You are about to alter the column `startDate` on the `EmployeeWorkDetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - Added the required column `employeePension` to the `EmployeePayroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employerPension` to the `EmployeePayroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incomeTax` to the `EmployeePayroll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EmployeePayroll` ADD COLUMN `employeePension` VARCHAR(191) NOT NULL,
    ADD COLUMN `employerPension` VARCHAR(191) NOT NULL,
    ADD COLUMN `incomeTax` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `EmployeeWorkDetail` MODIFY `startDate` DATETIME(3) NOT NULL;
