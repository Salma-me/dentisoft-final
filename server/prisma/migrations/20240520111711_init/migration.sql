-- AlterTable
ALTER TABLE `procedure` ADD COLUMN `diagnosisId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Procedure` ADD CONSTRAINT `Procedure_diagnosisId_fkey` FOREIGN KEY (`diagnosisId`) REFERENCES `Diagnosis`(`DiagnosisID`) ON DELETE SET NULL ON UPDATE CASCADE;
