-- DropForeignKey
ALTER TABLE `visit` DROP FOREIGN KEY `Visit_dentistSsn_fkey`;

-- DropForeignKey
ALTER TABLE `visit` DROP FOREIGN KEY `Visit_employeeSsn_fkey`;

-- DropForeignKey
ALTER TABLE `visit` DROP FOREIGN KEY `Visit_patientId_fkey`;

-- AlterTable
ALTER TABLE `visit` MODIFY `patientId` INTEGER NULL,
    MODIFY `dentistSsn` VARCHAR(191) NULL,
    MODIFY `employeeSsn` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_dentistSsn_fkey` FOREIGN KEY (`dentistSsn`) REFERENCES `Dentist`(`DentistSSN`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_employeeSsn_fkey` FOREIGN KEY (`employeeSsn`) REFERENCES `Employee`(`EmployeeSSN`) ON DELETE SET NULL ON UPDATE CASCADE;
