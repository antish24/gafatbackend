/*
  Warnings:

  - You are about to alter the column `applicableAfter` on the `LeaveType` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `LeaveType` MODIFY `applicableAfter` INTEGER NOT NULL;
