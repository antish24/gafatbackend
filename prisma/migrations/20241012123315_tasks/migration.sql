/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `SystemTasks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `SystemUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SystemTasks_code_key` ON `SystemTasks`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `SystemUser_email_key` ON `SystemUser`(`email`);
