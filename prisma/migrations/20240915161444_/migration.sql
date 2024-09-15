/*
  Warnings:

  - A unique constraint covering the columns `[fName,lName,mName,dateOfBirth]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Employee_fName_lName_mName_dateOfBirth_key` ON `Employee`(`fName`, `lName`, `mName`, `dateOfBirth`);
