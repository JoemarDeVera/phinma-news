-- AlterTable
ALTER TABLE `department` MODIFY `image` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `departmentpostcomment` MODIFY `media` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `departmentpostmedia` MODIFY `mediaUrl` LONGBLOB NOT NULL;

-- AlterTable
ALTER TABLE `postcomment` MODIFY `media` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `postmedia` MODIFY `mediaUrl` LONGBLOB NOT NULL;
