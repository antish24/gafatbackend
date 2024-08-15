/*
  Warnings:

  - A unique constraint covering the columns `[incidents,employeeId,companyId]` on the table `IncidentReports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `IncidentReports_incidents_employeeId_companyId_key` ON `IncidentReports`(`incidents`, `employeeId`, `companyId`);
