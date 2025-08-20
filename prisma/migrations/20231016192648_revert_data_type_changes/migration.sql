/*
  Warnings:

  - You are about to alter the column `image` on the `department` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `MediumText`.
  - You are about to alter the column `media` on the `departmentpostcomment` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `mediaUrl` on the `departmentpostmedia` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `MediumText`.
  - You are about to alter the column `media` on the `postcomment` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `mediaUrl` on the `postmedia` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `MediumText`.

*/
-- AlterTable
ALTER TABLE `department` MODIFY `image` MEDIUMTEXT NULL;

-- AlterTable
ALTER TABLE `departmentpostcomment` MODIFY `media` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `departmentpostmedia` MODIFY `mediaUrl` MEDIUMTEXT NOT NULL;

-- AlterTable
ALTER TABLE `postcomment` MODIFY `media` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `postmedia` MODIFY `mediaUrl` MEDIUMTEXT NOT NULL;
