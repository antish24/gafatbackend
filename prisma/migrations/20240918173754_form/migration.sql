/*
  Warnings:

  - A unique constraint covering the columns `[employeeProjectId,day,year,month]` on the table `TimeSheet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TimeSheet_employeeProjectId_day_year_month_key` ON `TimeSheet`(`employeeProjectId`, `day`, `year`, `month`);
