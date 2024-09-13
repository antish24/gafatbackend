-- AlterTable
ALTER TABLE `EmployeeContact` MODIFY `email` VARCHAR(191) NULL,
    MODIFY `otherPhone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `EmployeeRelatedInfo` MODIFY `maritalStatus` VARCHAR(191) NULL,
    MODIFY `ethnicGroup` VARCHAR(191) NULL,
    MODIFY `bloodGroup` VARCHAR(191) NULL,
    MODIFY `religion` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `EmployeeWorkDetail` MODIFY `salary` VARCHAR(191) NULL,
    MODIFY `bankName` VARCHAR(191) NULL,
    MODIFY `bankAccount` VARCHAR(191) NULL,
    MODIFY `TIN` VARCHAR(191) NULL;
