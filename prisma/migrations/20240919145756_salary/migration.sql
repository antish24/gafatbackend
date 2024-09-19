/*
  Warnings:

  - You are about to alter the column `conditionType` on the `SalaryComponent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(20))`.

*/
-- AlterTable
ALTER TABLE `SalaryComponent` MODIFY `pension` ENUM('Yes', 'No') NOT NULL DEFAULT 'No',
    MODIFY `tax` ENUM('Yes', 'Semi', 'No') NOT NULL DEFAULT 'No',
    MODIFY `semiTaxType` ENUM('Fixed', 'Percent', 'None') NOT NULL DEFAULT 'None',
    MODIFY `minNonTaxable` INTEGER NOT NULL DEFAULT 0,
    MODIFY `applicableAfter` INTEGER NOT NULL DEFAULT 1,
    MODIFY `conditionType` ENUM('Add', 'Deduct', 'Pension', 'IncomeTax') NOT NULL;
