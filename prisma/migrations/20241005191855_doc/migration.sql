/*
  Warnings:

  - You are about to drop the column `agreement` on the `DocFile` table. All the data in the column will be lost.
  - Added the required column `attachment` to the `DocFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DocFile` DROP COLUMN `agreement`,
    ADD COLUMN `attachment` VARCHAR(191) NOT NULL;
