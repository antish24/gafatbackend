/*
  Warnings:

  - You are about to drop the column `positionId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `Religion` on the `EmployeeRelatedInfo` table. All the data in the column will be lost.
  - You are about to drop the column `postion` on the `EmployeeWorkDetail` table. All the data in the column will be lost.
  - Added the required column `religion` to the `EmployeeRelatedInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_positionId_fkey`;

-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `positionId`;

-- AlterTable
ALTER TABLE `EmployeeRelatedInfo` DROP COLUMN `Religion`,
    ADD COLUMN `religion` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `EmployeeWorkDetail` DROP COLUMN `postion`;
