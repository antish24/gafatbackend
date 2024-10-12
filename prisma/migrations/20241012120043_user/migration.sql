-- CreateTable
CREATE TABLE `SystemUser` (
    `id` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `access` ENUM('Full', 'Read', 'Write') NOT NULL DEFAULT 'Read',
    `employeeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SystemUser_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemUserTasks` (
    `id` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SystemUserTasks_taskId_key`(`taskId`),
    UNIQUE INDEX `SystemUserTasks_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemTasks` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SystemUser` ADD CONSTRAINT `SystemUser_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `EmployeeWorkDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemUserTasks` ADD CONSTRAINT `SystemUserTasks_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `SystemTasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SystemUserTasks` ADD CONSTRAINT `SystemUserTasks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `SystemUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
