/*
  Warnings:

  - A unique constraint covering the columns `[workDetailId,projectId]` on the table `EmployeeProject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `EmployeeProject_workDetailId_projectId_key` ON `EmployeeProject`(`workDetailId`, `projectId`);
