/*
  Warnings:

  - You are about to drop the column `departmentId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `_departmentposttouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_departmenttouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_posttouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_departmentposttouser` DROP FOREIGN KEY `_DepartmentPostToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_departmentposttouser` DROP FOREIGN KEY `_DepartmentPostToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_departmenttouser` DROP FOREIGN KEY `_DepartmentToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_departmenttouser` DROP FOREIGN KEY `_DepartmentToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_posttouser` DROP FOREIGN KEY `_PostToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_posttouser` DROP FOREIGN KEY `_PostToUser_B_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `departmentId`;

-- DropTable
DROP TABLE `_departmentposttouser`;

-- DropTable
DROP TABLE `_departmenttouser`;

-- DropTable
DROP TABLE `_posttouser`;

-- CreateTable
CREATE TABLE `_department members` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_department members_AB_unique`(`A`, `B`),
    INDEX `_department members_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_liked posts` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_liked posts_AB_unique`(`A`, `B`),
    INDEX `_liked posts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_liked dp post` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_liked dp post_AB_unique`(`A`, `B`),
    INDEX `_liked dp post_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_department members` ADD CONSTRAINT `_department members_A_fkey` FOREIGN KEY (`A`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_department members` ADD CONSTRAINT `_department members_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_liked posts` ADD CONSTRAINT `_liked posts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_liked posts` ADD CONSTRAINT `_liked posts_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_liked dp post` ADD CONSTRAINT `_liked dp post_A_fkey` FOREIGN KEY (`A`) REFERENCES `DepartmentPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_liked dp post` ADD CONSTRAINT `_liked dp post_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
