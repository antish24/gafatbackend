-- CreateTable
CREATE TABLE `SalaryStructure` (
    `id` VARCHAR(191) NOT NULL,
    `salaryStructureFormId` VARCHAR(191) NOT NULL,
    `type` ENUM('Earning', 'Deduction') NOT NULL,
    `salaryComponentId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalaryStructureForm` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('InActive', 'Active') NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SalaryStructureForm_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeSalaryStructure` (
    `id` VARCHAR(191) NOT NULL,
    `salaryStructureFormId` VARCHAR(191) NOT NULL,
    `employeeWorkDetailId` VARCHAR(191) NOT NULL,
    `status` ENUM('InActive', 'Active') NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmployeeSalaryStructure_employeeWorkDetailId_key`(`employeeWorkDetailId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SalaryStructure` ADD CONSTRAINT `SalaryStructure_salaryStructureFormId_fkey` FOREIGN KEY (`salaryStructureFormId`) REFERENCES `SalaryStructureForm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalaryStructure` ADD CONSTRAINT `SalaryStructure_salaryComponentId_fkey` FOREIGN KEY (`salaryComponentId`) REFERENCES `SalaryComponent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSalaryStructure` ADD CONSTRAINT `EmployeeSalaryStructure_salaryStructureFormId_fkey` FOREIGN KEY (`salaryStructureFormId`) REFERENCES `SalaryStructureForm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSalaryStructure` ADD CONSTRAINT `EmployeeSalaryStructure_employeeWorkDetailId_fkey` FOREIGN KEY (`employeeWorkDetailId`) REFERENCES `EmployeeWorkDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
