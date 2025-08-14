-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `departmentpost` DROP FOREIGN KEY `DepartmentPost_postedWithId_fkey`;

-- DropForeignKey
ALTER TABLE `departmentpostcomment` DROP FOREIGN KEY `DepartmentPostComment_commentForId_fkey`;

-- DropForeignKey
ALTER TABLE `departmentpostcomment` DROP FOREIGN KEY `DepartmentPostComment_commentedById_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_postedById_fkey`;

-- DropForeignKey
ALTER TABLE `postcomment` DROP FOREIGN KEY `PostComment_commentForId_fkey`;

-- DropForeignKey
ALTER TABLE `postcomment` DROP FOREIGN KEY `PostComment_commentedById_fkey`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentPost` ADD CONSTRAINT `DepartmentPost_postedWithId_fkey` FOREIGN KEY (`postedWithId`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostComment` ADD CONSTRAINT `PostComment_commentedById_fkey` FOREIGN KEY (`commentedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostComment` ADD CONSTRAINT `PostComment_commentForId_fkey` FOREIGN KEY (`commentForId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentPostComment` ADD CONSTRAINT `DepartmentPostComment_commentedById_fkey` FOREIGN KEY (`commentedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentPostComment` ADD CONSTRAINT `DepartmentPostComment_commentForId_fkey` FOREIGN KEY (`commentForId`) REFERENCES `DepartmentPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
