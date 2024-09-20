-- CreateTable
CREATE TABLE `Payroll` (
    `id` VARCHAR(191) NOT NULL,
    `generatedBy` VARCHAR(191) NOT NULL,
    `basedOn` VARCHAR(191) NOT NULL,
    `positionId` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `from` DATETIME(3) NOT NULL,
    `to` DATETIME(3) NOT NULL,
    `ApprovedBy` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Failed') NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payroll_from_to_projectId_key`(`from`, `to`, `projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeePayroll` (
    `id` VARCHAR(191) NOT NULL,
    `payrollId` VARCHAR(191) NOT NULL,
    `employeeWorkDetailId` VARCHAR(191) NOT NULL,
    `salary` VARCHAR(191) NOT NULL,
    `totalEarning` VARCHAR(191) NOT NULL,
    `grossSalary` VARCHAR(191) NOT NULL,
    `totalDeduction` VARCHAR(191) NOT NULL,
    `netSalary` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Failed') NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeePayroll` ADD CONSTRAINT `EmployeePayroll_payrollId_fkey` FOREIGN KEY (`payrollId`) REFERENCES `Payroll`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeePayroll` ADD CONSTRAINT `EmployeePayroll_employeeWorkDetailId_fkey` FOREIGN KEY (`employeeWorkDetailId`) REFERENCES `EmployeeWorkDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
