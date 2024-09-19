/*
  Warnings:

  - You are about to alter the column `day` on the `TimeSheet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `month` on the `TimeSheet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `year` on the `TimeSheet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `TimeSheet` MODIFY `day` INTEGER NOT NULL,
    MODIFY `month` INTEGER NOT NULL,
    MODIFY `year` INTEGER NOT NULL;
