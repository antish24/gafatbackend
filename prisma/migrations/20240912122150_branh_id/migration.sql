/*
  Warnings:

  - A unique constraint covering the columns `[IDNO]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[IDNO]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[IDNO]` on the table `Position` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IDNO` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IDNO` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IDNO` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Branch` ADD COLUMN `IDNO` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Department` ADD COLUMN `IDNO` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Position` ADD COLUMN `IDNO` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Branch_IDNO_key` ON `Branch`(`IDNO`);

-- CreateIndex
CREATE UNIQUE INDEX `Department_IDNO_key` ON `Department`(`IDNO`);

-- CreateIndex
CREATE UNIQUE INDEX `Position_IDNO_key` ON `Position`(`IDNO`);
