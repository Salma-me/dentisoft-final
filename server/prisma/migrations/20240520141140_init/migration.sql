-- DropForeignKey
ALTER TABLE `medications` DROP FOREIGN KEY `Medications_TreatmentId_fkey`;

-- AlterTable
ALTER TABLE `medications` MODIFY `TreatmentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Medications` ADD CONSTRAINT `Medications_TreatmentId_fkey` FOREIGN KEY (`TreatmentId`) REFERENCES `Treatment`(`TreatmentID`) ON DELETE SET NULL ON UPDATE CASCADE;
