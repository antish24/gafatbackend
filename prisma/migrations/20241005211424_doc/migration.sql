/*
  Warnings:

  - A unique constraint covering the columns `[IDNO]` on the table `DocFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[docRef]` on the table `DocFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IDNO` to the `DocFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author` to the `DocFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docRef` to the `DocFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DocFile` ADD COLUMN `IDNO` VARCHAR(191) NOT NULL,
    ADD COLUMN `author` VARCHAR(191) NOT NULL,
    ADD COLUMN `docRef` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DocFile_IDNO_key` ON `DocFile`(`IDNO`);

-- CreateIndex
CREATE UNIQUE INDEX `DocFile_docRef_key` ON `DocFile`(`docRef`);
