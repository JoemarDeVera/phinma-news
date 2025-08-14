/*
  Warnings:

  - You are about to drop the column `departmentId` on the `departmentpost` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `departmentpost` DROP FOREIGN KEY `DepartmentPost_departmentId_fkey`;

-- DropIndex
DROP INDEX `DepartmentPost_postedWithId_fkey` ON `departmentpost`;

-- AlterTable
ALTER TABLE `departmentpost` DROP COLUMN `departmentId`;

-- AddForeignKey
ALTER TABLE `DepartmentPost` ADD CONSTRAINT `DepartmentPost_postedWithId_fkey` FOREIGN KEY (`postedWithId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
