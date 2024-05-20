-- CreateTable
CREATE TABLE `Procedure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `DentistSsn` VARCHAR(191) NULL,
    `PatientId` INTEGER NULL,

    UNIQUE INDEX `Procedure_DentistSsn_key`(`DentistSsn`),
    UNIQUE INDEX `Procedure_PatientId_key`(`PatientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_DentistSsn_fkey` FOREIGN KEY (`DentistSsn`) REFERENCES `Dentist`(`DentistSSN`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_PatientId_fkey` FOREIGN KEY (`PatientId`) REFERENCES `Patient`(`patientID`) ON DELETE SET NULL ON UPDATE CASCADE;
