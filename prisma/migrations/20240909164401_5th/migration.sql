/*
  Warnings:

  - You are about to drop the column `Experience` on the `Vacancy` table. All the data in the column will be lost.
  - Added the required column `experience` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Vacancy` DROP COLUMN `Experience`,
    ADD COLUMN `experience` VARCHAR(191) NOT NULL;
