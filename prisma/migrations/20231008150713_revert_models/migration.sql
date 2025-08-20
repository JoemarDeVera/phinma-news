/*
  Warnings:

  - You are about to drop the `_department members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_liked dp post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_liked posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_department members` DROP FOREIGN KEY `_department members_A_fkey`;

-- DropForeignKey
ALTER TABLE `_department members` DROP FOREIGN KEY `_department members_B_fkey`;

-- DropForeignKey
ALTER TABLE `_liked dp post` DROP FOREIGN KEY `_liked dp post_A_fkey`;

-- DropForeignKey
ALTER TABLE `_liked dp post` DROP FOREIGN KEY `_liked dp post_B_fkey`;

-- DropForeignKey
ALTER TABLE `_liked posts` DROP FOREIGN KEY `_liked posts_A_fkey`;

-- DropForeignKey
ALTER TABLE `_liked posts` DROP FOREIGN KEY `_liked posts_B_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `departmentId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_department members`;

-- DropTable
DROP TABLE `_liked dp post`;

-- DropTable
DROP TABLE `_liked posts`;

-- CreateTable
CREATE TABLE `_DepartmentToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DepartmentToUser_AB_unique`(`A`, `B`),
    INDEX `_DepartmentToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PostToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PostToUser_AB_unique`(`A`, `B`),
    INDEX `_PostToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DepartmentPostToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DepartmentPostToUser_AB_unique`(`A`, `B`),
    INDEX `_DepartmentPostToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DepartmentToUser` ADD CONSTRAINT `_DepartmentToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DepartmentToUser` ADD CONSTRAINT `_DepartmentToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToUser` ADD CONSTRAINT `_PostToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToUser` ADD CONSTRAINT `_PostToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DepartmentPostToUser` ADD CONSTRAINT `_DepartmentPostToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `DepartmentPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DepartmentPostToUser` ADD CONSTRAINT `_DepartmentPostToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
