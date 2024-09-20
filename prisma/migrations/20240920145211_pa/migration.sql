-- AddForeignKey
ALTER TABLE `Payroll` ADD CONSTRAINT `Payroll_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
