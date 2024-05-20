/*
  Warnings:

  - Made the column `TreatmentId` on table `medications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `medications` DROP FOREIGN KEY `Medications_TreatmentId_fkey`;

-- AlterTable
ALTER TABLE `medications` MODIFY `TreatmentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Medications` ADD CONSTRAINT `Medications_TreatmentId_fkey` FOREIGN KEY (`TreatmentId`) REFERENCES `Treatment`(`TreatmentID`) ON DELETE RESTRICT ON UPDATE CASCADE;
