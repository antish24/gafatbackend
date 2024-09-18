/*
  Warnings:

  - You are about to alter the column `maxLeaveDate` on the `LeaveType` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `withPay` on the `LeaveType` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(9))`.
  - Changed the type of `repeat` on the `LeaveType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `LeaveType` MODIFY `maxLeaveDate` INTEGER NOT NULL,
    MODIFY `applicableAfter` VARCHAR(191) NOT NULL,
    DROP COLUMN `repeat`,
    ADD COLUMN `repeat` INTEGER NOT NULL,
    MODIFY `withPay` ENUM('Yes', 'No', 'Other') NOT NULL;
