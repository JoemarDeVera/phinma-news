/*
  Warnings:

  - Added the required column `departmentId` to the `DepartmentPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `departmentpost` DROP FOREIGN KEY `DepartmentPost_postedWithId_fkey`;

-- AlterTable
ALTER TABLE `departmentpost` ADD COLUMN `departmentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `DepartmentPost` ADD CONSTRAINT `DepartmentPost_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
