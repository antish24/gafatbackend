/*
  Warnings:

  - A unique constraint covering the columns `[IDNO]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IDNO` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Interview` ADD COLUMN `IDNO` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Interview_IDNO_key` ON `Interview`(`IDNO`);
