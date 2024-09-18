-- AlterTable
ALTER TABLE `LeaveApplication` MODIFY `status` ENUM('Approved', 'Failed', 'Pending') NOT NULL DEFAULT 'Pending';
